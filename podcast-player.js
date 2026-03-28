// Podcast Player Functionality for Triumphant Book Club

// Utility Functions
function parseDuration(durationStr) {
    const match = durationStr.match(/(\d+)\s*min/);
    return match ? Number.parseInt(match[1]) * 60 : 0; // Convert to seconds
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

document.addEventListener('DOMContentLoaded', function() {
    
    // Podcast Episode Database
    const episodesDatabase = [
        {
            id: '34',
            title: 'Jennifer Wallace',
            guest: 'Author & Advocate',
            description: 'If you\'ve ever struggled to feel like you matter, you\'re not alone. Feeling like you matter is as essential to human existence as breathing. Jennifer shares her profound insights on building confidence and finding your voice.',
            date: 'March 10, 2024',
            duration: '45 min',
            audioFile: 'episode-34.mp3',
            cover: 'https://picsum.photos/seed/episode34/400/400',
            transcript: 'Full transcript available for this episode...',
            topics: ['Confidence', 'Self-Worth', 'Personal Growth', 'Advocacy'],
            showNotes: [
                'Book Recommendation: "Never Enough" by Jennifer Wallace',
                'Resource: National Self-Esteem Association',
                'Quote: "Your voice matters, your story matters, you matter."'
            ]
        },
        {
            id: '33',
            title: 'Julia Quinn',
            guest: 'Historical Romance Author',
            description: 'What better way to kick off month of love than with queen of historical romance, Julia Quinn? Julia discusses writing triumph stories that span generations and the joy of creating beloved characters.',
            date: 'March 3, 2024',
            duration: '52 min',
            audioFile: 'episode-33.mp3',
            cover: 'https://picsum.photos/seed/episode33/400/400',
            transcript: 'Full transcript available for this episode...',
            topics: ['Historical Fiction', 'Writing Process', 'Character Development', 'Romance'],
            showNotes: [
                'Featured Book: "Bridgerton Series" by Julia Quinn',
                'Writing Tip: Creating multi-generational stories',
                'Historical Research Methods for Authors'
            ]
        },
        {
            id: '32',
            title: 'Laura Dave',
            guest: 'Returning Triumphant Author',
            description: 'Returning Triumphant Book Club author, Laura Dave, gives us all of the earnest insights on her newest release, The First Time I Saw Him, and discusses crafting suspenseful stories of triumph.',
            date: 'February 24, 2024',
            duration: '48 min',
            audioFile: 'episode-32.mp3',
            cover: 'https://picsum.photos/seed/episode32/400/400',
            transcript: 'Full transcript available for this episode...',
            topics: ['Fiction', 'Suspense', 'Storytelling', 'Character Development'],
            showNotes: [
                'New Release: "The First Time I Saw Him" by Laura Dave',
                'Discussion: Building suspense in literary fiction',
                'Previous TBC Appearance: "The Last Thing He Told Me"'
            ]
        },
        {
            id: '31',
            title: 'Hamnet',
            guest: 'Literary Adaptation Discussion',
            description: 'This week, Danielle sits down to discuss the adaptation of Hamnet for the screen with director Chloé Zhao. They explore bringing stories of historical triumph to modern audiences.',
            date: 'February 17, 2024',
            duration: '55 min',
            audioFile: 'episode-31.mp3',
            cover: 'https://picsum.photos/seed/episode31/400/400',
            transcript: 'Full transcript available for this episode...',
            topics: ['Literary Adaptation', 'Film Making', 'Historical Fiction', 'Chloé Zhao'],
            showNotes: [
                'Book: "Hamnet" by Maggie O\'Farrell',
                'Director: Chloé Zhao (Academy Award Winner)',
                'Discussion: Book to Screen Adaptation Process'
            ]
        },
        {
            id: '30',
            title: 'People We Meet On Vacation',
            guest: 'Summer Reading Discussion',
            description: 'It may be winter, but this week we are feeling the summer heat with the crew behind beach reads that have become community favorites. Stories of triumph in paradise settings!',
            date: 'February 10, 2024',
            duration: '42 min',
            audioFile: 'episode-30.mp3',
            cover: 'https://picsum.photos/seed/episode30/400/400',
            transcript: 'Full transcript available for this episode...',
            topics: ['Summer Reading', 'Beach Reads', 'Vacation Stories', 'Community Favorites'],
            showNotes: [
                'Featured: "People We Meet on Vacation" by Emily Henry',
                'Genre Discussion: Evolution of Beach Reads',
                'Community Picks: Top 5 Summer TBC Selections'
            ]
        },
        {
            id: '29',
            title: 'Bobbi Brown',
            guest: 'Beauty & Business Icon',
            description: 'Happy New Year, book club besties! What better way to start anew than to chat with the woman who redefined beauty standards and built a triumphant business empire.',
            date: 'January 27, 2024',
            duration: '38 min',
            audioFile: 'episode-29.mp3',
            cover: 'https://picsum.photos/seed/episode29/400/400',
            transcript: 'Full transcript available for this episode...',
            topics: ['Business', 'Beauty Industry', 'Entrepreneurship', 'Personal Brand'],
            showNotes: [
                'Book: "Beauty from the Inside Out" by Bobbi Brown',
                'Business Lesson: Building a Global Brand',
                'Quote: "Beauty should be accessible to everyone."'
            ]
        }
    ];

    // State Management
    let currentEpisode = null;
    let isPlaying = false;
    let currentTime = 0;
    let duration = 0;
    let playbackSpeed = 1;
    let volume = 0.7;
    let isMuted = false;

    // DOM Elements
    const audioPlayerModal = document.getElementById('audioPlayerModal');
    const audioTitle = document.getElementById('audioTitle');
    const audioGuest = document.getElementById('audioAuthor'); // Reusing existing element
    const audioCover = document.getElementById('audioCover');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const audioProgress = document.getElementById('audioProgress');
    const currentTimeSpan = document.getElementById('currentTime');
    const totalTimeSpan = document.getElementById('totalTime');
    const speedBtn = document.getElementById('speedBtn');
    const speedMenu = document.querySelector('.speed-menu');
    const speedOptions = document.querySelectorAll('.speed-option');
    const volumeSlider = document.getElementById('volumeSlider');
    const muteBtn = document.getElementById('muteBtn');
    const bookmarkBtn = document.getElementById('bookmarkBtn');
    const sleepTimerBtn = document.getElementById('sleepTimerBtn');
    const chapterSelect = document.getElementById('chapterSelect');
    const closeAudioPlayerBtn = document.getElementById('closeAudioPlayer');

// Setup Podcast Episode Buttons
function setupPodcastButtons() {
    // Listen Now buttons
    const listenButtons = document.querySelectorAll('.listen-episode');
    
    listenButtons.forEach(btn => {
        // Remove any existing event listeners by cloning
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const episodeId = this.dataset.episode;
            if (episodeId) {
                openPodcastPlayer(episodeId);
            } else {
                console.log('No episode ID found');
            }
        });
    });

    // Convert anchor Listen Now buttons to button elements
    document.querySelectorAll('a[href="#episode"]').forEach(link => {
        if (link.textContent.includes('Listen Now')) {
            const button = document.createElement('button');
            button.className = 'btn btn-primary listen-episode';
            button.textContent = 'Listen Now';
            
            // Get episode ID from parent card
            const episodeCard = link.closest('.episode-card');
            const episodeNumber = episodeCard?.querySelector('.episode-number')?.textContent;
            if (episodeNumber) {
                button.dataset.episode = episodeNumber.replace('Episode ', '');
            }
            
            link.parentNode.replaceChild(button, link);
            
            // Add click event to new button
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const episodeId = this.dataset.episode;
                if (episodeId) {
                    openPodcastPlayer(episodeId);
                }
            });
        }
    });

    // Episode Details buttons
    const detailButtons = document.querySelectorAll('.view-details');
    detailButtons.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const episodeId = this.dataset.episode;
            if (episodeId) {
                showEpisodeDetails(episodeId);
            }
        });
    });
}

    // Open Podcast Player
    function openPodcastPlayer(episodeId) {
        currentEpisode = episodesDatabase.find(ep => ep.id === episodeId);
        if (!currentEpisode) return;

        // Update modal content
        audioTitle.textContent = currentEpisode.title;
        audioGuest.textContent = currentEpisode.guest;
        audioCover.src = currentEpisode.cover;
        audioCover.alt = `${currentEpisode.title} - ${currentEpisode.guest}`;

        // Reset player state
        currentTime = 0;
        duration = parseDuration(currentEpisode.duration);
        isPlaying = false;
        updatePlayerDisplay();

        // Show modal
        audioPlayerModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Setup chapter options
        setupChapterOptions(currentEpisode);
        
        // Show notification
        showNotification(`Loading "${currentEpisode.title}"...`);
    }

    // Setup Chapter Options
    function setupChapterOptions(episode) {
        chapterSelect.innerHTML = `
            <option value="1">Chapter 1: Introduction</option>
            <option value="2">Chapter 2: Guest Introduction</option>
            <option value="3">Chapter 3: Main Discussion</option>
            <option value="4">Chapter 4: Key Insights</option>
            <option value="5">Chapter 5: Takeaways & Conclusion</option>
        `;
    }

    // Update Player Display
    function updatePlayerDisplay() {
        // Update time display
        currentTimeSpan.textContent = formatTime(currentTime);
        totalTimeSpan.textContent = formatTime(duration);
        
        // Update progress bar
        const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
        audioProgress.style.width = `${progressPercent}%`;
        
        // Update play/pause button
        if (isPlaying) {
            playPauseBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16"/>
                    <rect x="14" y="4" width="4" height="16"/>
                </svg>
            `;
        } else {
            playPauseBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5,3 19,12 5,21"/>
                </svg>
            `;
        }
    }

    // Show Episode Details
    function showEpisodeDetails(episodeId) {
        const episode = episodesDatabase.find(ep => ep.id === episodeId);
        if (!episode) return;

        // Create and show details modal
        const detailsModal = createEpisodeDetailsModal(episode);
        document.body.appendChild(detailsModal);
        
        setTimeout(() => {
            detailsModal.classList.add('active');
        }, 100);
    }

    // Create Episode Details Modal
    function createEpisodeDetailsModal(episode) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay episode-details-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Episode ${episode.id}: ${episode.title}</h2>
                    <button class="modal-close" onclick="this.closest('.episode-details-modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="episode-details-content">
                        <div class="episode-cover-large">
                            <img src="${episode.cover}" alt="${episode.title}">
                        </div>
                        <div class="episode-info">
                            <div class="episode-meta">
                                <span class="episode-date">${episode.date}</span>
                                <span class="episode-duration">${episode.duration}</span>
                                <span class="episode-guest">${episode.guest}</span>
                            </div>
                            <p class="episode-description">${episode.description}</p>
                            
                            <div class="episode-topics">
                                <h4>Topics Covered:</h4>
                                <div class="topics-list">
                                    ${episode.topics.map(topic => `<span class="topic-tag">${topic}</span>`).join('')}
                                </div>
                            </div>
                            
                            <div class="show-notes">
                                <h4>Show Notes:</h4>
                                <ul>
                                    ${episode.showNotes.map(note => `<li>${note}</li>`).join('')}
                                </ul>
                            </div>
                            
                            <div class="episode-actions">
                                <button class="btn btn-primary" onclick="openPodcastPlayer('${episode.id}')">Listen Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return modal;
    }

    // Player Control Functions
    function togglePlayPause() {
        isPlaying = !isPlaying;
        updatePlayerDisplay();
        
        if (isPlaying) {
            showNotification('Playing episode');
            startPlaybackSimulation();
        } else {
            showNotification('Paused');
        }
    }

    function startPlaybackSimulation() {
        if (isPlaying && currentTime < duration) {
            currentTime += playbackSpeed;
            updatePlayerDisplay();
            requestAnimationFrame(startPlaybackSimulation);
        } else if (currentTime >= duration) {
            isPlaying = false;
            currentTime = 0;
            updatePlayerDisplay();
            showNotification('Episode completed');
        }
    }

    function changeSpeed(speed) {
        playbackSpeed = Number.parseFloat(speed);
        speedBtn.textContent = speed + 'x';
        speedMenu.classList.remove('active');
        showNotification(`Playback speed: ${speed}x`);
    }

    function toggleMute() {
        isMuted = !isMuted;
        if (isMuted) {
            volumeSlider.value = 0;
            muteBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="11,5 6,9 2,9 2,15 6,15 11,19 11,5"/>
                    <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" stroke-width="2"/>
                    <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" stroke-width="2"/>
                </svg>
            `;
        } else {
            volumeSlider.value = volume * 100;
            muteBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="11,5 6,9 2,9 2,15 6,15 11,19 11,5"/>
                    <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>
                </svg>
            `;
        }
        showNotification(isMuted ? 'Muted' : 'Unmuted');
    }

    function addBookmark() {
        if (currentEpisode) {
            const bookmark = {
                episodeId: currentEpisode.id,
                title: currentEpisode.title,
                timestamp: currentTime,
                note: 'Bookmark added via player'
            };
            
            let bookmarks = JSON.parse(localStorage.getItem('podcastBookmarks') || '[]');
            bookmarks.push(bookmark);
            localStorage.setItem('podcastBookmarks', JSON.stringify(bookmarks));
            
            showNotification('Bookmark added at ' + formatTime(currentTime));
        }
    }

    function setSleepTimer() {
        const timerMinutes = prompt('Set sleep timer (minutes):', '30');
        if (timerMinutes && !Number.isNaN(Number(timerMinutes))) {
            const timerMs = Number.parseInt(timerMinutes) * 60 * 1000;
            showNotification(`Sleep timer set for ${timerMinutes} minutes`);

            setTimeout(() => {
                if (isPlaying) {
                    togglePlayPause();
                    showNotification('Sleep timer: Episode paused');
                }
            }, timerMs);
        }
    }

    // Utility Functions

    function showNotification(message) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification, .notification-toast');
        existingNotifications.forEach(notif => notif.remove());
        
        const notification = document.createElement('div');
        notification.className = 'notification-toast';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.style.transform = 'translateX(0)', 100);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }



    // Event Listeners Setup
    function setupEventListeners() {
        // Play/Pause
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', togglePlayPause);
        }

        // Speed Control
        if (speedBtn) {
            speedBtn.addEventListener('click', function() {
                speedMenu.classList.toggle('active');
            });
        }

        speedOptions.forEach(option => {
            option.addEventListener('click', function() {
                changeSpeed(this.dataset.speed);
            });
        });

        // Volume Control
        if (volumeSlider) {
            volumeSlider.addEventListener('input', function() {
                volume = this.value / 100;
                if (!isMuted) {
                    showNotification(`Volume: ${Math.round(volume * 100)}%`);
                }
            });
        }

        // Mute Button
        if (muteBtn) {
            muteBtn.addEventListener('click', toggleMute);
        }

        // Bookmark Button
        if (bookmarkBtn) {
            bookmarkBtn.addEventListener('click', addBookmark);
        }

        // Sleep Timer
        if (sleepTimerBtn) {
            sleepTimerBtn.addEventListener('click', setSleepTimer);
        }

        // Close Modal
        if (closeAudioPlayerBtn) {
            closeAudioPlayerBtn.addEventListener('click', function() {
                audioPlayerModal.classList.remove('active');
                document.body.style.overflow = '';
                isPlaying = false;
                updatePlayerDisplay();
            });
        }

        // Close modal on backdrop click
        audioPlayerModal.addEventListener('click', function(e) {
            if (e.target === audioPlayerModal) {
                audioPlayerModal.classList.remove('active');
                document.body.style.overflow = '';
                isPlaying = false;
                updatePlayerDisplay();
            }
        });

        // Close modals with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                if (audioPlayerModal.classList.contains('active')) {
                    audioPlayerModal.classList.remove('active');
                    document.body.style.overflow = '';
                    isPlaying = false;
                    updatePlayerDisplay();
                }
                
                // Remove any episode details modals
                const detailsModal = document.querySelector('.episode-details-modal');
                if (detailsModal) {
                    detailsModal.remove();
                }
            }
        });

        // Click outside speed menu to close
        document.addEventListener('click', function(e) {
            if (!speedMenu.contains(e.target) && e.target !== speedBtn) {
                speedMenu.classList.remove('active');
            }
        });
    }

    // Add CSS for episode details modal
    const episodeModalStyles = document.createElement('style');
    episodeModalStyles.textContent = `
        .episode-details-modal .modal-content {
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            padding: 24px;
            border-radius: 16px;
        }
        
        .episode-details-content {
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 24px;
            align-items: start;
        }
        
        .episode-cover-large img {
            width: 100%;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }
        
        .episode-details-modal .episode-meta {
            display: flex;
            gap: 12px;
            margin-bottom: 16px;
            flex-wrap: wrap;
        }
        
        .episode-details-modal .episode-meta span {
            background: #F3F4F6;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.9rem;
        }
        
        .topics-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin: 8px 0;
        }
        
        .topic-tag {
            background: linear-gradient(135deg, #8B5CF6, #EC4899);
            color: white;
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 0.85rem;
        }
        
        .show-notes ul {
            margin-left: 20px;
        }
        
        .show-notes li {
            margin-bottom: 8px;
            color: #6B7280;
        }
        
        .episode-details-modal .episode-actions {
            display: flex;
            gap: 12px;
            margin-top: 24px;
            flex-wrap: wrap;
        }
        
        @media (max-width: 768px) {
            .episode-details-content {
                grid-template-columns: 1fr;
            }
            
            .episode-cover-large {
                max-width: 300px;
                margin: 0 auto;
            }
        }
    `;
    document.head.appendChild(episodeModalStyles);

    // Initialize Everything
    function init() {
        setupPodcastButtons();
        setupEventListeners();
        updatePlayerDisplay();
    }

    // Start the application
    init();
});