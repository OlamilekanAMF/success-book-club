from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import yt_dlp
from yt_dlp.utils import DownloadError
import os
import tempfile
import threading
import time
from datetime import datetime
import uuid

app = Flask(__name__)
CORS(app)

# Store download progress
download_progress = {}

def download_video_info(url):
    """Extract video information without downloading"""
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'extract_flat': False,
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            return {
                'title': info.get('title', 'Unknown'),
                'thumbnail': info.get('thumbnail', ''),
                'duration': info.get('duration', 0),
                'view_count': info.get('view_count', 0),
                'like_count': info.get('like_count', 0),
                'description': info.get('description', ''),
                'upload_date': info.get('upload_date', ''),
                'uploader': info.get('uploader', ''),
            }
    except DownloadError as e:
        raise ValueError(f"Failed to extract video info: {str(e)}")

def download_video(url, download_id, quality='720p'):
    """Download video in the background"""
    try:
        download_progress[download_id] = {'status': 'downloading', 'progress': 0}
        
        # Create temp directory
        temp_dir = tempfile.mkdtemp()
        
        # Determine format based on quality
        if quality == '1080p':
            format_selector = 'best[height<=1080]'
        elif quality == '720p':
            format_selector = 'best[height<=720]'
        elif quality == '480p':
            format_selector = 'best[height<=480]'
        elif quality == '360p':
            format_selector = 'best[height<=360]'
        else:
            format_selector = 'best[height<=720]'
        
        ydl_opts = {
            'format': format_selector,
            'outtmpl': os.path.join(temp_dir, '%(title)s.%(ext)s'),
            'quiet': True,
            'no_warnings': True,
            'progress_hooks': [lambda d: update_progress(download_id, d)],
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            filename = ydl.prepare_filename(info)

            # Update progress to completion
            download_progress[download_id] = {
                'status': 'completed',
                'progress': 100,
                'filename': filename,
                'title': info.get('title', 'video')
            }

    except DownloadError as e:
        download_progress[download_id] = {
            'status': 'error',
            'progress': 0,
            'error': str(e)
        }

def update_progress(download_id, d):
    """Update download progress"""
    if d['status'] == 'downloading':
        progress = d.get('_percent_str', '0%').replace('%', '')
        try:
            progress = float(progress)
        except:
            progress = 0
            raise
        
        download_progress[download_id] = {
            'status': 'downloading',
            'progress': progress,
            'speed': d.get('_speed_str', '0B/s'),
            'eta': d.get('_eta_str', 'Unknown')
        }

@app.route('/api/info', methods=['POST'])
def get_video_info():
    """Get video information"""
    try:
        data = request.json
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        info = download_video_info(url)
        return jsonify({'info': info})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/download', methods=['POST'])
def start_download():
    """Start video download"""
    try:
        data = request.json
        url = data.get('url')
        quality = data.get('quality', '720p')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        # Generate unique download ID
        download_id = str(uuid.uuid4())
        
        # Start download in background thread
        thread = threading.Thread(target=download_video, args=(url, download_id, quality))
        thread.daemon = True
        thread.start()
        
        return jsonify({'download_id': download_id})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/progress/<download_id>', methods=['GET'])
def get_progress(download_id):
    """Get download progress"""
    if download_id not in download_progress:
        return jsonify({'error': 'Download not found'}), 404
    
    return jsonify(download_progress[download_id])

@app.route('/api/download/file/<download_id>', methods=['GET'])
def download_file(download_id):
    """Download the completed video file"""
    if download_id not in download_progress:
        return jsonify({'error': 'Download not found'}), 404
    
    progress = download_progress[download_id]
    if progress['status'] != 'completed':
        return jsonify({'error': 'Download not completed'}), 400
    
    filename = progress.get('filename')
    if not filename or not os.path.exists(filename):
        return jsonify({'error': 'File not found'}), 404
    
    return send_file(
        filename,
        as_attachment=True,
        download_name=f"{progress.get('title', 'video')}.mp4",
        mimetype='video/mp4'
    )

@app.route('/api/clean/<download_id>', methods=['DELETE'])
def clean_download(download_id):
    """Clean up download files"""
    try:
        if download_id in download_progress:
            progress = download_progress[download_id]
            filename = progress.get('filename')

            # Delete file if it exists
            if filename and os.path.exists(filename):
                os.remove(filename)
                # Try to remove temp directory
                os.rmdir(os.path.dirname(filename))

            # Remove from progress tracking
            del download_progress[download_id]

        return jsonify({'success': True})

    except OSError as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)