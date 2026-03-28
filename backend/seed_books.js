const supabase = require('./src/config/supabase');

const books = [
    {
        title: 'The Unbreakable Spirit',
        author: 'Sarah Mitchell',
        category: 'spotlight',
        genre: 'Memoir',
        rating: 4.9,
        page_count: 376,
        is_featured: true,
        description: 'A powerful memoir of overcoming impossible odds, Sarah Mitchell shares her journey from devastating loss to finding hope and purpose. This inspiring true story demonstrates the extraordinary capacity of the human heart to heal and triumph over adversity.',
        cover_image: 'https://picsum.photos/seed/triumphant-featured/400/600'
    },
    {
        title: 'Rising from Ashes',
        author: 'Michael Torres',
        category: 'general',
        genre: 'Fiction',
        rating: 4.2,
        page_count: 342,
        is_featured: true,
        description: 'A powerful story of transformation and resilience. When Phoenix Martinez loses everything in a devastating fire, she must find the strength to rebuild her life from the ashes.',
        cover_image: 'https://picsum.photos/seed/book1/300/450'
    },
    {
        title: 'Against All Odds',
        author: 'Jennifer Liu',
        category: 'general',
        genre: 'Biography',
        rating: 4.8,
        page_count: 428,
        is_featured: true,
        description: 'Against insurmountable odds and facing discrimination in post-war America, Jennifer Liu broke barriers in medical school and became a pioneering neurosurgeon.',
        cover_image: 'https://picsum.photos/seed/book2/300/450'
    },
    {
        title: 'The Power Within',
        author: 'Dr. Robert Chen',
        category: 'general',
        genre: 'Self-Help',
        rating: 4.1,
        page_count: 367,
        is_featured: false,
        description: 'Dr. Robert Chen reveals the science behind resilience and personal transformation. Through cutting-edge research and compelling stories.',
        cover_image: 'https://picsum.photos/seed/book3/300/450'
    },
    {
        title: 'Unbroken Legacy',
        author: 'Maria Rodriguez',
        category: 'general',
        genre: 'Historical',
        rating: 4.6,
        page_count: 512,
        is_featured: false,
        description: 'A sweeping historical epic following three generations of women fighting for justice and equality in early 20th century America.',
        cover_image: 'https://picsum.photos/seed/book4/300/450'
    },
    {
        title: 'Journey Home',
        author: 'David Thompson',
        category: 'general',
        genre: 'Memoir',
        rating: 4.3,
        page_count: 389,
        is_featured: false,
        description: 'A heartfelt memoir about finding one\'s way back to oneself after years of lost identity.',
        cover_image: 'https://picsum.photos/seed/book5/300/450'
    },
    {
        title: 'Breaking Barriers',
        author: 'Amanda Foster',
        category: 'general',
        genre: 'Memoir',
        rating: 4.7,
        page_count: 298,
        is_featured: false,
        description: 'Amanda Foster chronicles her groundbreaking journey as the first woman in her field, overcoming systemic barriers and paving the way for future generations.',
        cover_image: 'https://picsum.photos/seed/breaking-barriers/300/450'
    },
    {
        title: 'The Last Mile',
        author: 'James Washington',
        category: 'general',
        genre: 'Fiction',
        rating: 4.5,
        page_count: 412,
        is_featured: false,
        description: 'In this gripping thriller, marathon runner Jake Martinez must complete the ultimate race - not just for glory, but to save his family.',
        cover_image: 'https://picsum.photos/seed/the-last-mile/300/450'
    },
    {
        title: 'Courage Under Fire',
        author: 'Patricia Kumar',
        category: 'general',
        genre: 'Biography',
        rating: 4.8,
        page_count: 367,
        is_featured: true,
        description: 'Firefighter Patricia Kumar shares harrowing stories from the front lines of disaster response, revealing the true meaning of courage.',
        cover_image: 'https://picsum.photos/seed/courage-under-fire/300/450'
    },
    {
        title: 'Rising Together',
        author: 'The Community Collective',
        category: 'general',
        genre: 'Self-Help',
        rating: 4.4,
        page_count: 289,
        is_featured: false,
        description: 'A collaborative work featuring stories from diverse communities coming together to overcome adversity.',
        cover_image: 'https://picsum.photos/seed/rising-together/300/450'
    }
];

async function seedBooks() {
    console.log('🚀 Starting book seeding...');

    try {
        // First, clear existing books to avoid duplicates if running multiple times
        const { error: deleteError } = await supabase
            .from('books')
            .delete()
            .neq('title', ''); // Delete all

        if (deleteError) {
            console.error('❌ Error clearing books:', deleteError.message);
            return;
        }

        console.log('🧹 Cleared existing books.');

        // Insert new books
        const { data, error } = await supabase
            .from('books')
            .insert(books);

        if (error) {
            console.error('❌ Error seeding books:', error.message);
        } else {
            console.log('✅ Successfully seeded ' + books.length + ' books!');
        }
    } catch (err) {
        console.error('❌ Unexpected error during seeding:', err);
    }
}

seedBooks();
