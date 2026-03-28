// Enhanced Book Discovery System for Triumphant Book Club
// This script adapts to different page contexts (blog, podcast, community, events)

// Utility functions (outer scope)
function detectPageContext() {
    const path = globalThis.location.pathname;
    if (path.includes('blog.html')) return 'blog';
    if (path.includes('podcast.html')) return 'podcast';
    if (path.includes('community.html')) return 'community';
    if (path.includes('events.html')) return 'events';
    return 'general';
}

function getStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '★'.repeat(fullStars);
    if (hasHalfStar) stars += '½';
    stars += '☆'.repeat(emptyStars);
    
    return `<span class="stars">${stars}</span>`;
}

function addToUserLibrary(book) {
    const library = JSON.parse(localStorage.getItem('userLibrary') || '[]');
    if (!library.some(b => b.id === book.id)) {
        library.push(book);
        localStorage.setItem('userLibrary', JSON.stringify(library));
    }
}

document.addEventListener('DOMContentLoaded', function() {
    
    // Detect current page context
    const pageContext = detectPageContext();
    
    // Book Database - Extended with blog posts, podcast episodes, and event books
    const contentDatabase = {
        books: [
            {
                id: 'rising-from-ashes',
                title: 'Rising from Ashes',
                author: 'Michael Torres',
                category: 'fiction',
                month: "January '24",
                rating: 4.2,
                reviewCount: 1247,
                pages: 342,
                audioDuration: '8h 45m',
                published: 'January 2024',
                description: 'A powerful story of transformation and resilience. When Phoenix Martinez loses everything in a devastating fire, she must find the strength to rebuild her life from the ashes. This compelling narrative explores the journey of overcoming trauma and discovering the unbreakable human spirit.',
                formats: ['ebook', 'audio', 'pdf'],
                featured: true,
                cover: 'https://picsum.photos/seed/book1/300/450'
            },
            {
                id: 'against-all-odds',
                title: 'Against All Odds',
                author: 'Jennifer Liu',
                category: 'biography',
                month: "December '23",
                rating: 4.8,
                reviewCount: 2341,
                pages: 428,
                audioDuration: '10h 20m',
                published: 'December 2023',
                description: 'Against insurmountable odds and facing discrimination in post-war America, Jennifer Liu broke barriers in medical school and became a pioneering neurosurgeon. Her journey from poverty to prominence is a testament to determination, intelligence, and the power of dreams.',
                formats: ['ebook', 'audio', 'pdf'],
                featured: true,
                cover: 'https://picsum.photos/seed/book2/300/450'
            },
            {
                id: 'the-power-within',
                title: 'The Power Within',
                author: 'Dr. Robert Chen',
                category: 'self-help',
                month: "November '23",
                rating: 4.1,
                reviewCount: 987,
                pages: 367,
                audioDuration: '6h 30m',
                published: 'November 2023',
                description: 'Dr. Robert Chen reveals the science behind resilience and personal transformation. Through cutting-edge research and compelling stories, he demonstrates how anyone can tap into their inner strength and overcome life\'s greatest challenges.',
                formats: ['ebook', 'audio', 'pdf'],
                popular: true,
                cover: 'https://picsum.photos/seed/book3/300/450'
            },
            {
                id: 'unbroken-legacy',
                title: 'Unbroken Legacy',
                author: 'Maria Rodriguez',
                category: 'historical',
                month: "October '23",
                rating: 4.6,
                reviewCount: 1892,
                pages: 512,
                audioDuration: '12h 15m',
                published: 'October 2023',
                description: 'A sweeping historical epic following three generations of women fighting for justice and equality in early 20th century America. Maria Rodriguez masterfully weaves together stories of courage, sacrifice, and the enduring power of family bonds.',
                formats: ['ebook', 'audio', 'pdf'],
                cover: 'https://picsum.photos/seed/book4/300/450'
            },
            {
                id: 'journey-home',
                title: 'Journey Home',
                author: 'David Thompson',
                category: 'memoir',
                month: "September '23",
                rating: 4.3,
                reviewCount: 756,
                pages: 389,
                audioDuration: '9h 10m',
                published: 'September 2023',
                description: 'A heartfelt memoir about finding one\'s way back to oneself after years of lost identity. David Thompson\'s journey of self-discovery, family reconciliation, and healing offers profound insights into the meaning of home and belonging.',
                formats: ['ebook', 'audio', 'pdf'],
                new: true,
                cover: 'https://picsum.photos/seed/book5/300/450'
            }
        ],
        episodes: [
            {
                id: '34',
                title: 'Jennifer Wallace',
                guest: 'Author & Advocate',
                duration: '45 min',
                date: 'March 10, 2024',
                description: 'If you\'ve ever struggled to feel like you matter, you\'re not alone. Feeling like you matter is as essential to human existence as breathing. Jennifer shares her profound insights on building confidence and finding your voice.',
                cover: 'https://picsum.photos/seed/episode34/400/400',
                bookId: 'against-all-odds'
            },
            {
                id: '33',
                title: 'Julia Quinn',
                guest: 'Historical Romance Author',
                duration: '52 min',
                date: 'March 3, 2024',
                description: 'What better way to kick off the month of love than with the queen of historical romance, Julia Quinn? Julia discusses writing triumph stories that span generations and the joy of creating beloved characters.',
                cover: 'https://picsum.photos/seed/episode33/400/400',
                bookId: 'unbroken-legacy'
            },
            {
                id: '32',
                title: 'Laura Dave',
                guest: 'Returning Triumphant Author',
                duration: '48 min',
                date: 'February 24, 2024',
                description: 'Returning Triumphant Book Club author, Laura Dave, gives us all of the earnest insights on her newest release, The First Time I Saw Him, and discusses crafting suspenseful stories of triumph.',
                cover: 'https://picsum.photos/seed/episode32/400/400',
                bookId: 'journey-home'
            }
        ],
        blogPosts: [
            {
                id: 'blog1',
                title: 'The Complete List Of Triumphant Book Club Picks',
                author: 'Editorial Team',
                date: 'March 10, 2024',
                category: 'Book Rec',
                readTime: '8 min read',
                excerpt: 'Since our founding, we\'ve been recommending our favorite books to readers through Triumphant Book Club. Here is full list of all our picks that celebrate stories of triumph and resilience.',
                image: 'https://picsum.photos/seed/blog1/400/250',
                bookId: 'rising-from-ashes'
        },
        {
            id: 'blog2',
            title: 'Treat Your Shelf to a Gift of Reading',
            author: 'Emma Watson',
            date: 'March 8, 2024',
            category: 'Reading Tips',
            readTime: '6 min',
            excerpt: 'It\'s giving Season All year round. Discover our limited-edition subscription boxes – perfect gift for the bookish person in your life who loves stories of triumph.',
            fullContent: `
                <h2>The Perfect Gift for Every Book Lover</h2>
                <p>At Triumphant Book Club, we believe that the joy of reading deserves to be celebrated year-round. That's why we've created our exclusive subscription boxes—thoughtfully curated collections that turn the simple act of reading into a luxurious experience of discovery and delight.</p>
                
                <h3>Why Reading Makes the Perfect Gift</h3>
                <p>A good book does more than entertain—it transforms, educates, and inspires. When you give someone a subscription box, you're not just giving them paper and ink; you're giving them new worlds to explore, different perspectives to consider, and countless hours of adventure and reflection.</p>
                
                <blockquote>
                    <em>"The gift of a book is the gift of a thousand different lives lived and experienced, All contained within pages waiting to be discovered."</em>
                    <cite>— Emma Watson, Lifestyle Editor</cite>
                </blockquote>
                
                <h3>Our Seasonal Subscription Boxes</h3>
                <p>Each box is carefully themed and curated to match the season's mood and reading preferences. Here's What Makes Our subscription boxes special:</p>
                
                <h4>🌸 Spring Collection - March-May</h4>
                <p>Themes of renewal, growth, and new beginnings. Perfect for books about transformation and fresh starts.</p>
                <ul>
                    <li>Limited edition bookmark with spring floral design</li>
                    <li>Tea sampler from local artisans</li>
                    <li>Author-signed book plates</li>
                    <li>Spring reading challenge tracker</li>
                </ul>
                
                <h4>☀️ Summer Collection - June-August</h4>
                <p>Beach reads and vacation stories that transport you to paradise. Light, uplifting tales perfect for lazy afternoons.</p>
                <ul>
                    <li>Tropical-scented bookmark</li>
                    <li>Portable book light</li>
                    <li>Summer reading log Journal</li>
                    <li>Beach tote bag with club logo</li>
                </ul>
                
                <h4>🍂 Fall Collection - September-November</h4>
                <p>Cozy mysteries and historical fiction perfect for crisp autumn evenings. Stories of reflection and gratitude.</p>
                <ul>
                    <li>Autumn-spiced candle</li>
                    <li>Leather bookmark with embossing</li>
                    <li>Fall reading challenge card</li>
                    <li>Hot chocolate sampler pack</li>
                </ul>
                
                <h4>❄️ Winter Collection - December-February</h4>
                <p>Heartwarming stories of resilience and hope to carry you through the darkest months. Tales of triumph over adversity.</p>
                <ul>
                    <li>Winter scene bookmark</li>
                    <li>Hand-knit reading socks</li>
                    <li>Hot cocoa mix</li>
                    <li>Seasonal reading planner</li>
                </ul>
                
                <h3>How to Gift a Subscription</h3>
                <p>Giving someone a Triumphant Book Club subscription box is simple and meaningful:</p>
                
                <ol>
                    <li><strong>Choose Your Plan:</strong> Select from 3, 6, or 12-month subscriptions</li>
                    <li><strong>Personalize It:</strong> Add recipient's reading preferences and favorite genres</li>
                    <li><strong>Add a Message:</strong> Include a personal note to make it extra special</li>
                    <li><strong>Select Delivery:</strong> One-time gift or ongoing subscription</li>
                </ol>
                
                <h3>Join Our Gift Community</h3>
                <p>Our subscription boxes have created a wonderful community of readers who share their unboxing experiences, reading recommendations, and the joy of discovering new books together. Every box becomes an opportunity to connect with fellow book lovers who appreciate the power of triumphant storytelling.</p>
            `,
            image: 'https://picsum.photos/seed/blog2/400/250',
            bookId: 'the-power-within',
            authorBio: 'Emma Watson is our lifestyle editor focusing on reading culture, gift ideas, and creating magical reading experiences.'
        },
        {
            id: 'blog3',
            title: 'Behind The Book with Eliana Ramage',
            author: 'Michael Torres',
            date: 'March 5, 2024',
            category: 'Behind the Book',
            readTime: '10 min',
            excerpt: 'Curious to learn more about our September Pick? Go behind the Book with author Eliana Ramage as she shares her Cherokee roots and how they inspire her writing of triumphant stories.',
            fullContent: `
                <h2>Rooted in Story, Reaching for the Stars</h2>
                <p>Eliana Ramage sits at the intersection of tradition and innovation, her Cherokee heritage weaving through every word she writes about triumph and resilience. As the author of our September selection, she brings voices that have long been silenced into the contemporary literary conversation.</p>
                
                <h3>The Power of Heritage in Storytelling</h3>
                <p>For Eliana, writing is not just about creating compelling characters—it's about honoring the generations who came before her. Her stories are deeply rooted in Cherokee oral traditions, yet they speak with universal resonance to anyone who has ever felt like an outsider finding their place in the world.</p>
                
                <blockquote>
                    <em>"When we tell stories of our ancestors, we keep them alive. When we write stories inspired by their wisdom, we ensure their voices will never be forgotten. Every word I write is both a tribute to those who came before me and a beacon for those who will come after."</em>
                    <cite>— Eliana Ramage</cite>
                </blockquote>
                
                <h3>From Cherokee Traditions to Modern Pages</h3>
                <p>Eliana's journey as an author hasn't been traditional. She spent years learning the craft by listening to elders around campfires, absorbing the rhythm and cadence of stories passed down through generations. These oral traditions form the foundation of her writing style, creating a unique voice that feels both ancient and immediate.</p>
                
                <h3>The Stories We Choose to Tell</h3>
                <p>Our September pick represents more than just good storytelling—it represents a deliberate choice to amplify Native voices in a literary landscape that has historically marginalized Indigenous authors. Through Eliana's work, readers experience stories of triumph that are both culturally specific and universally human.</p>
                
                <h4>Traditional Elements in Modern Writing</h4>
                <ul>
                    <li><strong>Story Circles:</strong> Eliana structures her narratives like the gathering spaces where stories were traditionally shared</li>
                    <li><strong>Seasonal Cycles:</strong> Her writing follows natural patterns of growth, harvest, and renewal found in Cherokee culture</li>
                    <li><strong>Interconnectedness:</strong> Every character and plot point reflects the Cherokee understanding that all things are connected</li>
                    <li><strong>Respect for Nature:</strong> Environmental metaphors draw from Cherokee relationships with the natural world</li>
                </ul>
                
                <h3>Writing Process and Inspiration</h3>
                <p>Eliana's daily routine combines ancient practice with modern discipline. She begins each morning with traditional ceremonies, spends afternoons writing in a space surrounded by meaningful objects from her heritage, and ends her days by sharing stories with younger members of her community.</p>
                
                <p>This blend of old and new, of personal heritage and universal themes, creates stories that feel both grounded and transcendent. Her work reminds us that the most powerful triumph stories often come from voices that have been overlooked but have always had wisdom to share.</p>
                
                <h3>Join the Conversation</h3>
                <p>We invite you to discover Eliana Ramage's work not just as entertainment, but as an opportunity to engage with stories that bridge cultures, generations, and ways of understanding. Her triumph is not just her own—it's the triumph of a community seeing itself reflected in literature for the first time.</p>
            `,
            image: 'https://picsum.photos/seed/blog3/400/250',
            tags: ['behind-the-book', 'cherokee-heritage', 'author-interview'],
            authorBio: 'Eliana Ramage is a Cherokee author whose work bridges traditional storytelling with contemporary themes of resilience and triumph.'
        },
        {
            id: 'blog4',
            title: 'Want To Know What Happens After Firekeeper\'s Daughter?',
            author: 'Jennifer Liu',
            date: 'February 28, 2024',
            category: 'Literary Analysis',
            readTime: '15 min',
            excerpt: 'Angeline Boulley returns to the world of her Triumphant Book Club Pick in this thrilling continuation that explores what happens after triumph.',
            fullContent: `
                <h2>Beyond the Ending: Stories Continue</h2>
                <p>Some endings are not really endings at all—they're doorways to new beginnings. Angeline Boulley's "Firekeeper's Daughter" captured our hearts with its powerful exploration of trauma, healing, and cultural identity. Now, in this stunning follow-up, Boulley asks the question every reader has pondered: What happens after the triumph?</p>
                
                <h3>The Legacy of Firekeeper's Daughter</h3>
                <p>Before diving into the continuation, it's worth remembering what made the original so special. Published in 2020, "Firekeeper's Daughter" introduced us to a world where colonizers attempted to erase Indigenous culture, but where language, tradition, and memory fought to survive. The story of characters navigating between worlds became both a critical success and a cultural touchstone.</p>
                
                <blockquote>
                    <em>"The original book was about the violence of assimilation, but also about the violence required to survive assimilation. Sometimes survival means keeping parts of yourself hidden, even from yourself."</em>
                    <cite>— Literary Scholar, American Book Review</cite>
                </blockquote>
                
                <h3>New Territory, Same Heart</h3>
                <p>The new book picks up where the original left off, but with expanded scope and ambition. Where "Firekeeper's Daughter" focused on one young woman's journey through the residential school system, the sequel widens its lens to examine how multiple generations navigate the complex legacy of cultural suppression and resilience.</p>
                
                <h4>Themes That Deepen and Expand</h4>
                <ul>
                    <li><strong>Interconnected Trauma:</strong> How historical wounds echo across generations</li>
                    <li><strong>Language as Resistance:</strong> The ongoing battle to preserve Indigenous languages and stories</li>
                    <li><strong>Urban vs. Traditional Identity:</strong> Characters navigating between modern city life and cultural roots</li>
                    <li><strong>Found Family:</strong> The search for belonging when traditional structures have been disrupted</li>
                </ul>
                
                <h3>The Craft of the Sequel</h3>
                <p>Boulley approaches this follow-up with the same meticulous research and emotional honesty that made the original so powerful. She spent years conducting interviews with residential school survivors, linguists working to preserve endangered languages, and community elders keeping traditional stories alive.</p>
                
                <p>The result is a book that doesn't just continue a story—it expands a universe. Readers will encounter familiar faces alongside new characters, each bringing their own perspective to the ongoing conversation about cultural survival and rebirth.</p>
                
                <h3>Why This Sequel Matters</h3>
                <p>In a literary landscape where Indigenous stories have historically been told by others, Boulley's decision to control her own narrative is revolutionary. This sequel represents more than just entertainment—it's an act of cultural reclamation and artistic sovereignty.</p>
                
                <p>It reminds us that stories of triumph are not singular events but ongoing processes. The end of one challenge often becomes the beginning of another, and True resilience lies in the courage to keep telling those stories, no matter the Cost.</p>
            `,
            image: 'https://picsum.photos/seed/blog4/400/250',
            tags: ['literary-analysis', 'sequel', 'indigenous-literature'],
            authorBio: 'Jennifer Liu is a literary critic and cultural commentator whose work focuses on Indigenous literature and contemporary narrative analysis.'
        },
        {
            id: 'blog5',
            title: 'Highlights Of The Month',
            author: 'Community Team',
            date: 'February 25, 2024',
            category: 'Community',
            readTime: '5 min',
            excerpt: 'Celebrate with us as we recap most inspiring moments, powerful discussions, and triumph stories that made this month special in our community.',
            fullContent: `
                <h2>February's Moments of Triumph</h2>
                <p>Some months are special not just for what happens within our pages, but for how our community comes alive around them. February 2024 was one of those months—a time when discussions spilled beyond our regular meetings, when new connections were forged, and when the power of shared stories created ripples of inspiration far beyond our reading circle.</p>
                
                <h3>📚 Book Club Meeting Highlights</h3>
                <p>Our February selection, "Unbroken Legacy" by Maria Rodriguez, sparked some of our most passionate discussions yet. Members shared personal stories of immigration, family separation, and the courage to start new lives—themes that resonated deeply with our diverse community.</p>
                
                <blockquote>
                    <em>"Reading 'Unbroken Legacy' together felt like we were all sitting around a family table, hearing stories that could have been our own ancestors' experiences. The book didn't just teach us about history—it made us feel part of it."</em>
                    <cite>— Maria Rodriguez, Club Member</cite>
                </blockquote>
                
                <h4>Discussion Themes That Emerged:</h4>
                <ul>
                    <li><strong>Cultural Identity:</strong> How we maintain heritage while adapting to new environments</li>
                    <li><strong>Mother-Daughter Relationships:</strong> The bonds that shape families across generations</li>
                    <li><strong>Historical Memory:</strong> The importance of preserving and passing down family stories</li>
                    <li><strong>Starting Over:</strong> Courage required to rebuild after loss and displacement</li>
                </ul>
                
                <h3>🎉 Community Celebration Night</h3>
                <p>Midway through the month, we hosted our first-ever Community Celebration Night. What started as a simple Book discussion evolved into an evening of storytelling, music, food, and connection. Members from different backgrounds shared their own family traditions, creating a beautiful tapestry of human experience.</p>
                
                <h3>🌟 Member Spotlight Achievements</h3>
                <p>February was also remarkable for individual triumphs within our community:</p>
                
                <ul>
                    <li><strong>Sarah Mitchell:</strong> Launched her small business selling handmade bookmarks featuring quotes from diverse authors</li>
                    <li><strong>James Chen:</strong> Completed his English as a Second Language classes and can now participate more fully in discussions</li>
                    <li><strong>Amanda Foster:</strong> Organized a workplace book drive that collected over 500 books for local schools</li>
                    <li><strong>Robert Johnson:</strong> Shared his story of overcoming addiction at our community recovery meeting</li>
                </ul>
                
                <h3>📖 Beyond the Book Club</h3>
                <p>Our February impact extended beyond our regular meetings. Local schools invited our members to speak about their reading experiences, and our Book recommendation boxes were featured in a regional lifestyle magazine. The stories of triumph we're reading together are inspiring conversations in coffee shops, family gatherings, and workplaces throughout our area.</p>
                
                <h3>Looking Forward</h3>
                <p>As we move into March, we carry the energy of February's connections with us. The discussions, celebrations, and individual achievements remind us that our Book Club is more than a reading group—it's a community where stories of triumph find not just readers, but champions who carry those stories forward in their own lives.</p>
                
                <blockquote>
                    <em>"A book club is only as strong as stories its members live out in the World. This month, we didn't just read about triumph—we witnessed it happening All around us."</em>
                    <cite>— Danielle Robay, Podcast Host</cite>
                </blockquote>
            `,
            image: 'https://picsum.photos/seed/blog5/400/250',
            tags: ['community-highlights', 'member-achievements', 'book-club-events'],
            authorBio: 'Our community team documents and celebrates collective achievements and inspiring moments from our Triumphant Book Club members.'
        },
        {
            id: 'blog6',
            title: 'Hilda\'s Guatemalan Tamales',
            author: 'Ana Reyes',
            date: 'February 20, 2024',
            category: 'Lifestyle',
            readTime: '7 min',
            excerpt: 'Taste the story with House in the Pines author Ana Reyes\' family tamale recipe! A delicious blend of culture, tradition, and warmth of family gatherings.',
            fullContent: `
                <h2>The Flavor of Home</h2>
                <p>Some recipes are more than instructions—they're stories passed down through generations, carrying the aroma of family kitchens and the warmth of gatherings around shared tables. Ana Reyes' family tamale recipe is one such treasure, a taste of Guatemalan heritage that has found its way into the hearts of our Triumphant Book Club community.</p>
                
                <h3>More Than Just a Recipe</h3>
                <p>When Ana shared her family's tamale recipe with us, she wasn't just offering cooking instructions—she was inviting us into her home, her history, and the traditions that bring her family together. The recipe represents centuries of cultural knowledge, adapted and preserved through love and necessity.</p>
                
                <blockquote>
                    <em>"Every tamale we make carries the stories of everyone who has ever helped make them. The corn masa tells of harvest and community, the filling speaks of celebration and abundance, the corn husks whisper of protection and tradition, and the steam rises like prayers carrying our hopes to the heavens."</em>
                    <cite>— Ana Reyes</cite>
                </blockquote>
                
                <h3>The Heritage Behind the Recipe</h3>
                <p>Reyes traces her family's tamale tradition back to her great-grandmother's kitchen in rural Guatemala. Each ingredient tells a story: corn, grown in family fields and harvested by hand; spices, traded in local markets and chosen with care; banana leaves, gathered and prepared with specific techniques passed down through generations.</p>
                
                <h4>The Cultural Significance</h4>
                <p>In Guatemalan culture, tamales are more than food—they're symbols of community, celebration, and cultural identity. Families gather to make them together for holidays, festivals, and special occasions. The process is as important as the final product, with each step carrying meaning and reinforcing family bonds.</p>
                
                <h3>Recipe and Technique</h3>
                <p>What makes Ana's family recipe special is the perfect balance of traditional technique and personal innovation:</p>
                
                <h4>The Masa (Corn Dough)</h4>
                <ul>
                    <li><strong>Stone-Ground Corn:</strong> Created using a metate, the traditional grinding stone that has been in her family for generations</li>
                    <li><strong>Caldo Richness:</strong> The broth is simmered for hours with chicken, pork, and vegetables, creating depth of flavor</li>
                    <li><strong>Consistency:</strong> The dough must be right texture—not too wet, not too dry, perfect for spreading</li>
                </ul>
                
                <h4>The Filling</h4>
                <ul>
                    <li><strong>Seasoned Pork:</strong> Slow-cooked until tender, then shredded with traditional spices</li>
                    <li><strong>Green Olives:</strong> For brightness and briny contrast</li>
                    <li><strong>Raisins:</strong> Sweetness and tradition, each one representing a prayer or wish</li>
                    <li><strong>Capers:</strong> Little bursts of tangy surprise throughout the filling</li>
                </ul>
                
                <h4>The Wrapping Process</h4>
                <p>The most time-consuming part of tamale making is wrapping, but it's also where the most love is invested. Softened corn husks become fragile packages holding stories and traditions. Each fold is precise, each tie is intentional, and finished bundles are Little gifts waiting to be unwrapped.</p>
                
                <h3>Bringing Heritage to New Generations</h3>
                <p>Ana is working on a cookbook to preserve not just the recipe, but the stories behind it. She's teaching her children and nieces the same techniques her grandmother taught her, ensuring these traditions continue to flourish in new lands and new contexts.</p>
                
                <p>For our Book Club community, Ana's recipe became more than just food—it became a conversation starter about heritage, immigration, and the ways we carry our homes with us wherever we go. The tamale represents the universal human experience of finding nourishment in both food and family tradition.</p>
                
                <h3>Join the Tradition</h3>
                <p>We invite you to try Ana's recipe and share your own family food traditions with our community. The stories behind our favorite dishes are as nourishing as the meals themselves—they feed our souls and connect us across cultures and generations.</p>
            `,
            image: 'https://picsum.photos/seed/blog6/400/250',
            tags: ['recipe', 'guatemalan-cuisine', 'family-traditions', 'cultural-heritage'],
            authorBio: 'Ana Reyes is a chef and food writer who specializes in preserving and sharing traditional Guatemalan recipes with modern sensibilities.'
        }
    ],
    featuredArticle: {
            id: 'featured',
            title: 'How Do You Raise Children in a Delicate World?',
            author: 'Sarah Mitchell',
            date: 'March 15, 2024',
            category: 'Author Interview',
            readTime: '12 min',
            excerpt: 'Award-winning author Charlotte McConaghy shares her insights on shaping a book of love stories for our world, our family, and generations to come. In this intimate conversation, McConaghy discusses the responsibility of writing hope in challenging times.',
            fullContent: `
                <h2>Crafting Hope in Challenging Times</h2>
                <p>Charlotte McConaghy sits at the intersection of experience and imagination, writing stories that illuminate the darkest corners of human experience while finding the light that makes life worth living. In this intimate conversation, the award-winning author of "Wild Dark Shore" shares her insights on writing stories of love, loss, and resilience for a world that often feels anything but delicate.</p>
                
                <h3>The Responsibility of Hope</h3>
                <p>As a writer, McConaghy feels the weight of representing hope—not false hope, but the authentic, messy, complicated hope that people actually live with. She believes that stories should acknowledge the difficulties of life while also celebrating the small moments of beauty and connection that make existence meaningful.</p>
                
                <blockquote>
                    <em>"I think the most dangerous thing to write about is hope. Because if you get it wrong, you're not just giving people false comfort—you're actively breaking their spirit. But to write about despair, to never acknowledge the possibility of redemption, that feels like a betrayal of the human condition."</em>
                    <cite>— Charlotte McConaghy</cite>
                </blockquote>
                
                <h3>Writing for Future Generations</h3>
                <p>McConaghy's approach to writing is deeply influenced by her role as a mother and her concern for the world her children will inherit. She thinks carefully about the stories we tell ourselves and others, understanding that narratives shape how we see ourselves and our possibilities.</p>
                
                <h4>Themes in Her Work</h4>
                <ul>
                    <li><strong>Environmental Consciousness:</strong> The delicate relationship between humanity and nature</li>
                    <li><strong>Mother-Daughter Bonds:</strong> The complex, beautiful, and sometimes painful relationships between mothers and daughters</li>
                    <li><strong>Small Acts of Courage:</strong> How ordinary people demonstrate extraordinary resilience</li>
                    <li><strong>Hope vs. Despair:</strong> Finding meaning in difficult circumstances</li>
                </ul>
                
                <h3>The Writing Process</h3>
                <p>McConaghy describes her writing routine as both disciplined and dream-like. She writes in the morning hours, finding quiet space to explore difficult emotions, then spends afternoons researching and evenings sharing her work with trusted readers. Her process involves extensive rewriting, with some stories going through dozens of revisions before they feel ready to meet the world.</p>
                
                <h3>Advice for Aspiring Writers</h3>
                <p>For those looking to follow in her footsteps, McConaghy offers both practical and philosophical advice:</p>
                
                <ul>
                    <li><strong>Read Widely:</strong> "You can't be a writer if you're not a reader. Every book you read teaches you something about the craft."</li>
                    <li><strong>Embrace Difficulty:</strong> "The hard parts are where the growth happens. Don't avoid them—they're where you'll find your most authentic voice."</li>
                    <li><strong>Find Your People:</strong> "Connect with readers who understand what you're trying to say. Your people are out there waiting for your stories."</li>
                    <li><strong>Stay Curious:</strong> "Maintain the wonder you had as a child. The world needs more adults who are still asking questions."</li>
                </ul>
                
                <p>Her upcoming projects include a new novel exploring climate change through a mother's eyes and a collection of essays on writing craft. For Triumphant Book Club members, Charlotte McConaghy represents not just literary excellence, but the courage to write honestly about hope in all its complicated, beautiful forms.</p>
            `,
            image: 'https://picsum.photos/seed/blog-featured/800/500',
            tags: ['author-interview', 'writing-craft', 'hope', 'motherhood'],
            authorBio: 'Charlotte McConaghy is an award-winning author known for her beautiful prose and deep understanding of human resilience.'
        }
    };

    // State Management
    let currentAudio = null;
    let isPlaying = false;

    // DOM Elements
    const bookModal = document.getElementById('bookModal');
    const audioPlayerModal = document.getElementById('audioPlayerModal');
    
    // Setup event listeners based on page context
    function setupEventListeners() {
        switch(pageContext) {
            case 'blog':
                setupBlogListeners();
                break;
            case 'podcast':
                setupPodcastListeners();
                break;
            case 'community':
                setupCommunityListeners();
                break;
            case 'events':
                setupEventsListeners();
                break;
            default:
                setupGeneralListeners();
        }
        
        // Setup modal close listeners
        setupModalListeners();
    }

    // Blog Page Specific Listeners
    function setupBlogListeners() {
        document.querySelectorAll('.preview').forEach(btn => {
            btn.addEventListener('click', function() {
                const bookId = this.dataset.book;
                const book = contentDatabase.books.find(b => b.id === bookId);
                if (book) showBookModal(book);
            });
        });

        document.querySelectorAll('.download').forEach(btn => {
            btn.addEventListener('click', function() {
                const bookId = this.dataset.book;
                const book = contentDatabase.books?.find(b => b.id === bookId);
                if (book) showDownloadModal(book);
            });
        });
    }

    // Podcast Page Specific Listeners
    function setupPodcastListeners() {
        document.querySelectorAll('.listen-episode').forEach(btn => {
            btn.addEventListener('click', function() {
                const episodeId = this.dataset.episode;
                const episode = contentDatabase.episodes.find(e => e.id === episodeId);
                if (episode) openAudioPlayer(episode);
            });
        });

        document.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', function() {
                const episodeId = this.dataset.episode;
                const episode = contentDatabase.episodes.find(e => e.id === episodeId);
                if (episode && episode.bookId) {
                    const book = contentDatabase.books.find(b => b.id === episode.bookId);
                    if (book) showBookModal(book);
                }
            });
        });

        // Also setup favorite book clicks
        document.querySelectorAll('.favorite-book').forEach(book => {
            book.addEventListener('click', function() {
                const bookTitle = this.querySelector('h5').textContent;
                const book = contentDatabase.books.find(b => b.title.includes(bookTitle.split(' ')[0]));
                if (book) showBookModal(book);
            });
        });
    }

    // Community Page Specific Listeners
    function setupCommunityListeners() {
        document.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', function() {
                const bookId = this.dataset.book;
                const book = contentDatabase.books.find(b => b.id === bookId);
                if (book) showBookModal(book);
            });
        });
    }

    // Events Page Specific Listeners
    function setupEventsListeners() {
        document.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', function() {
                const bookId = this.dataset.book;
                const book = contentDatabase.books.find(b => b.id === bookId);
                if (book) showBookModal(book);
            });
        });
    }

    // General Listeners
    function setupGeneralListeners() {
        // Fallback for any other page
        document.querySelectorAll('[data-book]').forEach(btn => {
            btn.addEventListener('click', function() {
                const bookId = this.dataset.book;
                const book = contentDatabase.books.find(b => b.id === bookId);
                if (book) showBookModal(book);
            });
        });
    }

    // Modal Listeners
    function setupModalListeners() {
        // Close modals
        const closeButtons = document.querySelectorAll('.modal-close');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                if (this.id === 'closeModal') {
                    closeBookModal();
                } else if (this.id === 'closeAudioPlayer') {
                    closeAudioPlayer();
                }
            });
        });

        // Click outside to close
        [bookModal, audioPlayerModal].forEach(modal => {
            if (modal) {
                modal.addEventListener('click', function(e) {
                    if (e.target === modal) {
                        modal.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                });
            }
        });

        // Escape key to close
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeBookModal();
                closeAudioPlayer();
            }
        });
    }

    // Book Modal Functions
    function showBookModal(book) {
        if (!bookModal) return;

        // Fill modal with book data
        document.getElementById('modalTitle').textContent = book.title;
        document.getElementById('modalBookCover').src = book.cover;
        document.getElementById('modalAuthor').textContent = book.author;
        document.getElementById('modalCategory').textContent = book.category;
        document.getElementById('modalPages').textContent = book.pages;
        document.getElementById('modalDuration').textContent = book.audioDuration;
        document.getElementById('modalPublished').textContent = book.published;
        document.getElementById('modalDescription').textContent = book.description;
        document.getElementById('modalRating').innerHTML = getStarRating(book.rating);
        document.getElementById('modalRatingCount').textContent = `(${book.reviewCount.toLocaleString()} reviews)`;

        // Show modal
        bookModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Setup modal interactions
        setupBookModalInteractions(book);
    }

    function showDownloadModal(book) {
        showBookModal(book);
        // Scroll to download section
        setTimeout(() => {
            const downloadSection = document.querySelector('.action-group');
            if (downloadSection) {
                downloadSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 300);
    }

    function closeBookModal() {
        if (bookModal) {
            bookModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    function setupBookModalInteractions(book) {
        const downloadOptions = document.querySelectorAll('.download-option');
        const confirmDownload = document.getElementById('confirmDownload');
        const addToLibrary = document.getElementById('addToLibrary');
        const shareBook = document.getElementById('shareBook');

        // Download options
        downloadOptions.forEach(btn => {
            btn.addEventListener('click', function() {
                const format = this.dataset.format;
                downloadBook(book, format);
            });
        });

        // Confirm download
        if (confirmDownload) {
            confirmDownload.addEventListener('click', function() {
                closeBookModal();
                showDownloadProgress();
            });
        }

        // Add to library
        if (addToLibrary) {
            addToLibrary.addEventListener('click', function() {
                addToUserLibrary(book);
                showNotification('Book added to your library!');
            });
        }

        // Share
        if (shareBook) {
            shareBook.addEventListener('click', function() {
                shareBookDetails(book);
            });
        }
    }

    // Audio Player Functions
    function openAudioPlayer(content) {
        if (!audioPlayerModal) return;

        const title = content.title || content.guest || 'Unknown';
        const author = content.author || content.guest || 'Unknown';
        const cover = content.cover || 'https://picsum.photos/seed/default-audio/400/400';
        const duration = content.duration || content.audioDuration || 'Unknown';

        // Fill audio player with content data
        document.getElementById('audioTitle').textContent = title;
        document.getElementById('audioAuthor').textContent = author;
        document.getElementById('audioCover').src = cover;
        document.getElementById('totalTime').textContent = duration;

        // Show modal
        audioPlayerModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Setup audio controls
        setupAudioControls(content);
    }

    function closeAudioPlayer() {
        if (audioPlayerModal) {
            audioPlayerModal.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }
        isPlaying = false;
    }

    function setupAudioControls(content) {
        const playPauseBtn = document.getElementById('playPauseBtn');
        const speedBtn = document.getElementById('speedBtn');
        const speedMenu = document.querySelector('.speed-menu');
        const speedOptions = document.querySelectorAll('.speed-option');
        const volumeSlider = document.getElementById('volumeSlider');
        const muteBtn = document.getElementById('muteBtn');
        const bookmarkBtn = document.getElementById('bookmarkBtn');
        const sleepTimerBtn = document.getElementById('sleepTimerBtn');

        // Play/Pause
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', togglePlayPause);
        }

        // Speed control
        if (speedBtn) {
            speedBtn.addEventListener('click', function() {
                if (speedMenu) speedMenu.classList.toggle('active');
            });
        }

        if (speedOptions) {
            speedOptions.forEach(option => {
                option.addEventListener('click', function() {
                    const speed = this.dataset.speed;
                    setPlaybackSpeed(speed);
                    if (speedBtn) speedBtn.textContent = speed + 'x';
                    if (speedMenu) speedMenu.classList.remove('active');
                });
            });
        }

        // Volume control
        if (volumeSlider) {
            volumeSlider.addEventListener('input', function() {
                setVolume(this.value / 100);
            });
        }

        // Other controls
        if (muteBtn) muteBtn.addEventListener('click', toggleMute);
        if (bookmarkBtn) bookmarkBtn.addEventListener('click', addBookmark);
        if (sleepTimerBtn) sleepTimerBtn.addEventListener('click', setSleepTimer);

        // Click outside to close speed menu
        document.addEventListener('click', function(e) {
            if (speedMenu && !speedBtn.contains(e.target) && !speedMenu.contains(e.target)) {
                speedMenu.classList.remove('active');
            }
        });
    }

    // Utility Functions
    function downloadBook(book, format) {
        showNotification(`Downloading ${book.title} (${format.toUpperCase()})...`);
        // Simulate download progress
        setTimeout(() => {
            showNotification(`Download complete: ${book.title}`);
        }, 2000);
    }

    function shareBookDetails(book) {
        if (navigator.share) {
            navigator.share({
                title: book.title,
                text: `Check out "${book.title}" by ${book.author}`,
                url: globalThis.location.href
            });
        } else {
            navigator.clipboard.writeText(`Check out "${book.title}" by ${book.author}`);
            showNotification('Link copied to clipboard!');
        }
    }

    function showDownloadProgress() {
        const progressInfo = document.getElementById('downloadProgress');
        if (!progressInfo) return;
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    progressInfo.textContent = 'Download complete!';
                }, 1000);
            }
            
            progressInfo.textContent = `Downloading... ${Math.round(progress)}%`;
        }, 200);
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification-toast';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-blue);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Audio Control Functions (simulated)
    function togglePlayPause() {
        isPlaying = !isPlaying;
        const btn = document.getElementById('playPauseBtn');
        
        if (btn) {
            if (isPlaying) {
                btn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16"/>
                    <rect x="14" y="4" width="4" height="16"/>
                </svg>`;
                showNotification('Audio playing');
            } else {
                btn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5,3 19,12 5,21"/>
                </svg>`;
                showNotification('Audio paused');
            }
        }
    }

    function setPlaybackSpeed(speed) {
        showNotification(`Playback speed: ${speed}x`);
    }

    function setVolume(volume) {
        showNotification(`Volume: ${Math.round(volume * 100)}%`);
    }

    function toggleMute() {
        showNotification('Mute toggled');
    }

    function addBookmark() {
        showNotification('Bookmark added');
    }

    function setSleepTimer() {
        showNotification('Sleep timer set');
    }

    // Add CSS animation for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .notification-toast {
            animation: slideInRight 0.3s ease;
        }
    `;
    document.head.appendChild(style);

    // Initialize everything
    setupEventListeners();
});