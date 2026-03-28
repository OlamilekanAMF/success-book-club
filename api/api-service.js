/**
 * API Service Layer for Blog - Combined File
 * This service handles all API calls to the blog backend.
 * 
 * To connect to a real backend:
 * 1. Set USE_MOCK_API = false
 * 2. Update BASE_URL to your API endpoint
 * 3. Ensure your backend implements the endpoints below
 */

// ============================================
// MOCK DATA (In production, this comes from backend)
// ============================================

const MOCK_ARTICLES = [
    {
        id: 'featured-1',
        title: 'The Art of Storytelling: How to Captivate Your Readers from Page One',
        slug: 'art-of-storytelling-captivate-readers',
        category: 'Writing Craft',
        author: 'James Mitchell',
        authorBio: 'James Mitchell is an award-winning author and writing coach with over 15 years of experience in publishing. He has written 8 bestselling novels and teaches creative writing at NYU.',
        authorImg: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        date: '2026-02-12',
        dateFormatted: 'February 12, 2026',
        readTime: '12 min read',
        image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=500&fit=crop',
        imageAlt: 'Writer typing on a laptop with coffee',
        excerpt: 'Every great book begins with a single sentence that hooks the reader immediately. In this comprehensive guide, we explore the techniques that bestselling authors use to create unforgettable openings.',
        tags: ['storytelling', 'writing', 'beginners', 'hooks'],
        featured: true,
        views: 15420,
        content: `
            <p>Every great book begins with a single sentence that hooks the reader immediately. In this comprehensive guide, we explore the techniques that bestselling authors use to create unforgettable openings that keep readers turning pages late into the night. Whether you're writing your first novel or you're a seasoned author looking to refine your craft, understanding the art of storytelling is essential to your success.</p>
            
            <p>The truth is, readers make decisions about whether to continue reading within the first few paragraphs—or even the first few your sentences. This means opening needs to do heavy lifting: it must establish tone, create intrigue, and promise that the journey ahead will be worth their time. In this guide, we'll break down proven strategies that work across all genres.</p>
            
            <h2>The Power of the First Line</h2>
            <p>Your opening line is your first—and perhaps most important—opportunity to captivate your reader. It sets the tone, establishes your voice, and makes a promise about the journey ahead. Studies show that readers decide whether to continue a book within the first few paragraphs, making your opening absolutely critical to your book's success.</p>
            
            <blockquote>"The first sentence is the most important one in any book. If it doesn't grab the reader, nothing else will." — Robert Greene</blockquote>
            
            <p>Think about the books that have stayed with you throughout your life. Chances are, you remember their opening lines with vivid clarity. "It was the best of times, it was the worst of times." "Call me Ishmael." "In a hole in the ground there lived a hobbit." These openings have endured for decades because they immediately pull readers into their worlds.</p>
            
            <h2>Types of Compelling Openings</h2>
            <p>There are several proven approaches to opening your novel or non-fiction work. Each has its strengths, and the best choice depends on your genre, tone, and story. Let's explore the most effective types:</p>
            
            <ul>
                <li><strong>The Hook:</strong> Start with action that demands attention. Drop readers into a scene already in progress—something unusual, dangerous, or intriguing is happening. This creates immediate tension.</li>
                <li><strong>The Question:</strong> Pose a question your reader wants answered. Make them curious enough to keep reading to find the answer.</li>
                <li><strong>The Statement:</strong> Make a bold claim or observation. Challenge conventional wisdom or present a provocative idea.</li>
                <li><strong>The Scene:</strong> Drop readers into a vivid moment. Use sensory details to create an immersive experience.</li>
            </ul>
            
            <p>The key is to choose an opening that aligns with your story's core promise. If you're writing a thriller, start with tension. If it's a romance, begin with emotion. Your opening should be a microcosm of the entire reading experience.</p>
            
            <h2>Common Mistakes to Avoid</h2>
            <p>While crafting your opening, be wary of these common pitfalls that can kill reader interest before it even begins:</p>
            
            <ul>
                <li><strong>Starting with backstory or exposition:</strong> Resist the urge to explain everything upfront. Trust your reader to piece things together.</li>
                <li><strong>Beginning with weather descriptions:</strong> Unless weather is crucial to your plot, skip it. Readers don't care about the weather unless it matters.</li>
                <li><strong>Opening with a character waking up:</strong> This is one of the most common—and boring—ways to start a story. It's generic and signals to readers that nothing interesting is happening.</li>
                <li><strong>Using too much dialogue too soon:</strong> Without context, dialogue can be confusing. Readers need to know who's speaking and why it matters.</li>
            </ul>
            
            <p>Avoiding these mistakes doesn't mean your opening has to be perfect on the first try. The key is to recognize what isn't working and revise until it sings. Many professional writers write dozens of versions of their opening before settling on the right one.</p>
            
            <h2>Practice Exercise</h2>
            <p>Take your current opening and try rewriting it using each of the techniques above. You might be surprised which version resonates most with your target audience. Here are the steps:</p>
            
            <ol>
                <li>Write your current opening as-is</li>
                <li>Rewrite it as an action scene</li>
                <li>Rewrite it as a question</li>
                <li>Rewrite it as a bold statement</li>
                <li>Rewrite it as an immersive scene</li>
                <li>Share each version with beta readers and note which one grabs them</li>
            </ol>
            
            <p>Remember, the best openings are those that create intrigue while hinting at the emotional journey to come. Your readers are trusting you with their time—make every sentence count. The art of storytelling is a craft that improves with practice, patience, and persistence.</p>
        `,
        relatedArticles: ['article-1', 'article-5', 'article-10']
    },
    {
        id: 'article-1',
        title: 'Finding Your Unique Author Voice in a Crowded Market',
        slug: 'finding-unique-author-voice',
        category: 'Writing Craft',
        author: 'Sarah Johnson',
        authorBio: 'Sarah Johnson is a bestselling author and literary consultant. She helps writers develop their unique voice and build their author platform.',
        authorImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        date: '2026-02-10',
        dateFormatted: 'February 10, 2026',
        readTime: '8 min read',
        image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=220&fit=crop',
        imageAlt: 'Person writing in a notebook',
        excerpt: 'Your voice is what makes readers fall in love with your books. Discover how to develop and refine your unique writing style.',
        tags: ['voice', 'style', 'branding'],
        featured: false,
        views: 8934,
        content: `
            <p>Your voice is what makes readers fall in love with your books. It's the unique fingerprint of your writing—the way you phrase things, your rhythm, your worldview. In a market flooded with new releases every day, finding and developing your unique author voice is more important than ever. It's what makes readers choose your book over thousands of others.</p>
            
            <p>Think about your favorite authors. You can probably recognize their writing even before you see their name on the cover. That's voice. It's the personality that shines through your words, the distinctive quality that makes your work unmistakably yours. Developing this takes time, but it's the single most valuable investment you can make in your writing career.</p>
            
            <h2>What is Author Voice?</h2>
            <p>Voice encompasses many elements: your word choices, sentence structures, tone, perspective, and the themes you naturally gravitate toward. It's not something you can fake—it must be authentic. Your voice is influenced by everything that makes you unique: your background, experiences, sense of humor, and the way you see the world.</p>
            
            <blockquote>"Your voice is the most powerful tool you have as a writer. It's what makes readers come back for more." — Nora Roberts</blockquote>
            
            <p>Many aspiring writers try to imitate their favorite authors, thinking that's what publishers want. But the most successful authors are those who dare to be different. Your quirks, your perspectives, your unique way of seeing the world—these are your greatest assets.</p>
            
            <h2>Developing Your Voice</h2>
            <p>The best way to find your voice is through consistent writing practice. Here are proven strategies that can help you discover and refine your unique sound:</p>
            
            <ul>
                <li><strong>Write regularly:</strong> Even if it's just journaling, make writing a daily habit. Voice develops through practice.</li>
                <li><strong>Read widely in your genre:</strong> But also read outside your genre. Exposure to different styles expands your toolkit.</li>
                <li><strong>Write first, edit later:</strong> Don't censor yourself while drafting. Some of your best voicey lines will come when you stop editing.</li>
                <li><strong>Embrace your quirks:</strong> Don't smooth out every rough edge. Sometimes those imperfections are what make your voice distinctive.</li>
                <li><strong>Write what excites you:</strong> Passion shows in your writing. Write the stories that set your soul on fire.</li>
            </ul>
            
            <p>Remember, your voice will evolve throughout your career. What feels authentic now might change as you grow as a writer—and that's perfectly fine. The journey of discovering your voice is ongoing, and every step is valuable.</p>
        `,
        relatedArticles: ['featured-1', 'article-5', 'article-8']
    },
    {
        id: 'article-2',
        title: 'Screenwriting 101: Transitioning from Page to Screen',
        slug: 'screenwriting-101-page-to-screen',
        category: 'Script Writing',
        author: 'Michael Chen',
        authorBio: 'Michael Chen is a Hollywood screenwriter with credits on major film and TV productions. He also teaches screenwriting at USC.',
        authorImg: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        date: '2026-02-08',
        dateFormatted: 'February 8, 2026',
        readTime: '10 min read',
        image: 'https://images.unsplash.com/photo-1535016120720-40c6874c3b13?w=400&h=220&fit=crop',
        imageAlt: 'Movie clapperboard',
        excerpt: 'The transition from novel writing to screenwriting requires understanding a whole new language of visual storytelling.',
        tags: ['screenwriting', 'film', 'adaptation'],
        featured: false,
        views: 6721,
        content: `
            <p>The transition from novel writing to screenwriting requires understanding a whole new language of visual storytelling. While both crafts share fundamental storytelling principles, the techniques for engaging an audience differ significantly. Screenwriting is a unique discipline that demands you think in images, not words.</p>
            
            <p>Many successful novelists have tried their hand at screenwriting, only to discover that what works on the page doesn't always work on screen. The key difference is this: novels are a medium for reading, while films are a medium for watching. In prose, you can dive into a character's thoughts. On screen, you must show those thoughts through action and dialogue.</p>
            
            <h2>Key Differences</h2>
            <p>Understanding these differences is crucial before you start your screenplay journey. Here are the fundamental distinctions every writer should know:</p>
            
            <ul>
                <li><strong>Show, Don't Tell:</strong> Screenplays must be visual. You can't use internal monologue. If a character is sad, you show them crying, not think "I feel sad."</li>
                <li><strong>Formatting:</strong> Scripts have strict formatting rules that must be followed. Industry-standard formatting shows professionalism.</li>
                <li><strong>Economy of Words:</strong> Every line must earn its place. In screenplays, less is more. White space is your friend.</li>
                <li><strong>Structure:</strong> Screenplays follow a three-act structure rigidly, with specific page counts for each act.</li>
                <li><strong>Dialogue:</strong> Movie dialogue is different from real speech—it's compressed, purposeful, and reveals character efficiently.</li>
            </ul>
            
            <p>The learning curve can be steep, but many successful novelists have made the transition. The key is understanding that you're writing directions for a visual medium, not telling a story directly to readers. You're creating a blueprint that directors, actors, and cinematographers will bring to life.</p>
            
            <h2>Getting Started</h2>
            <p>Start by watching films with the script in hand. Many screenplays are available online for free. Study how professional screenwriters convey action, dialogue, and pacing. Notice how they handle transitions, scene breaks, and the delicate balance between showing and telling.</p>
            
            <p>Then, practice. Write short scenes. Focus on visual storytelling. Challenge yourself to convey emotion without words. With dedication, you can master this exciting craft and open new doors for your stories.</p>
        `,
        relatedArticles: ['featured-1', 'article-10', 'article-11']
    },
    {
        id: 'article-3',
        title: 'Traditional vs. Self-Publishing: Making the Right Choice',
        slug: 'traditional-vs-self-publishing',
        category: 'Author Success',
        author: 'Emma Williams',
        authorBio: 'Emma Williams is a publishing industry veteran with 20 years of experience at major publishing houses.',
        authorImg: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop',
        date: '2026-02-06',
        dateFormatted: 'February 6, 2026',
        readTime: '15 min read',
        image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=220&fit=crop',
        imageAlt: 'Books on a shelf',
        excerpt: 'One of the biggest decisions you\'ll make as an author is how to publish your book. We break down the pros and cons.',
        tags: ['publishing', 'career', 'business'],
        featured: false,
        views: 12456,
        content: `
            <p>One of the biggest decisions you'll make as an author is how to publish your book. Both traditional and self-publishing have their merits—and their drawbacks. Understanding each path will help you make the right choice for your goals, timeline, and appetite for business responsibilities.</p>
            
            <p>This decision impacts every aspect of your publishing journey, from how much control you have to how much money you can potentially earn. There's no universally "right" answer—it depends entirely on your individual circumstances and what you want from your writing career.</p>
            
            <h2>Traditional Publishing</h2>
            <p>Traditional publishing involves working with a publishing house that handles editing, design, printing, distribution, and marketing. You receive an advance against royalties, and the publisher handles the business side.</p>
            
            <p><strong>The Pros:</strong></p>
            <ul>
                <li><strong>Advance payment:</strong> You receive money upfront (typically $1,000-$100,000+) before the book releases.</li>
                <li><strong>Professional editing and design:</strong> Publishers provide professional editors and designers.</li>
                <li><strong>Distribution to bookstores:</strong> Traditional publishers have relationships with bookstores and libraries.</li>
                <li><strong>Industry credibility:</strong> Traditional publishing still carries weight in certain circles.</li>
                <li><strong>Rights licensing:</strong> Publishers handle foreign rights, audio rights, and other licensing.</li>
            </ul>
            
            <p><strong>The Cons:</strong></p>
            <ul>
                <li><strong>Longer timeline:</strong> From acceptance to publication typically takes 1-2 years.</li>
                <li><strong>Loss of creative control:</strong> Editors and publishers have final say on covers, titles, and content.</li>
                <li><strong>Rights ownership issues:</strong> You often sign away significant rights.</li>
                <li><strong>Rejection from agents/publishers:</strong> The submission process can take years.</li>
                <li><strong>Lower royalty rates:</strong> Typically 10-15% for print, 25% for ebooks.</li>
            </ul>
            
            <h2>Self-Publishing</h2>
            <p>Self-publishing puts you in complete control of every aspect of your book's creation and distribution. You retain all rights and keep a higher percentage of profits.</p>
            
            <p><strong>The Pros:</strong></p>
            <ul>
                <li><strong>Complete creative control:</strong> You make all decisions about covers, titles, and content.</li>
                <li><strong>Higher royalty percentages:</strong> You keep 35-70% of each sale.</li>
                <li><strong>Faster publication:</strong> You can publish in weeks, not years.</li>
                <li><strong>Direct reader relationships:</strong> You build your own mailing list and audience.</li>
                <li><strong>Unlimited earnings potential:</strong> No ceiling on how much you can earn.</li>
            </ul>
            
            <p><strong>The Cons:</strong></p>
            <ul>
                <li><strong>Upfront costs:</strong> You'll invest in editing, covers, and marketing.</li>
                <li><strong>Must handle all marketing:</strong> The burden of promotion falls entirely on you.</li>
                <li><strong>No advance payment:</strong> You must fund the process yourself.</li>
                <li><strong>Bookstore distribution challenges:</strong> Getting into physical bookstores is difficult.</li>
                <li><strong>Quality concerns:</strong> The market is flooded, making quality crucial.</li>
            </ul>
            
            <p>The right choice depends on your goals, timeline, and willingness to handle business aspects of publishing. Many authors choose hybrid paths, pursuing both traditional and self-publishing simultaneously.</p>
        `,
        relatedArticles: ['article-7', 'article-11']
    },
    {
        id: 'article-4',
        title: 'Overcoming Writer\'s Block: Proven Strategies That Actually Work',
        slug: 'overcoming-writers-block',
        category: 'Motivation',
        author: 'David Park',
        authorBio: 'David Park is a psychologist specializing in creativity and author productivity.',
        authorImg: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
        date: '2026-02-04',
        dateFormatted: 'February 4, 2026',
        readTime: '7 min read',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=220&fit=crop',
        imageAlt: 'Person thinking at desk',
        excerpt: 'Writer\'s block hits every author at some point. Here\'s what science tells us about getting creativity flowing again.',
        tags: ['writer\'s block', 'creativity', 'productivity'],
        featured: false,
        views: 18934,
        content: `
            <p>Writer's block hits every author at some point. But it doesn't have to derail your creative journey. Here's what science tells us about getting creativity flowing again. Understanding the psychology behind this common phenomenon can help you overcome it faster.</p>
            
            <p>First, know that writer's block is not a reflection of your abilities or worth as a writer. Even the most prolific authors experience it regularly. The key is having strategies to push through when it strikes.</p>
            
            <h2>Understanding Writer's Block</h2>
            <p>Writer's block is often fear-based—the perfectionist in us freezes because we worry our words won't be good enough. It's the internal critic gone silent, preventing us from creating anything at all. Understanding this can help you move past it.</p>
            
            <blockquote>"You can always edit a bad page. You can't edit a blank page." — Jodi Picoult</blockquote>
            
            <p>Other causes include burnout, lack of clear direction in the story, external stress, and physical factors like exhaustion or poor health. Identifying the root cause can help you address it directly.</p>
            
            <h2>Proven Strategies</h2>
            <p>These techniques have helped thousands of writers get back to creating:</p>
            
            <ul>
                <li><strong>Freewriting:</strong> Write continuously for 10-15 minutes without editing. Let the words flow even if they don't make sense.</li>
                <li><strong>Change Your Environment:</strong> Work from a new location—a coffee shop, library, or park. A change of scenery can spark new ideas.</li>
                <li><strong>Lower Your Standards:</strong> Give yourself permission to write badly. Tell yourself you're just drafting and can fix it later.</li>
                <li><strong>Break It Down:</strong> Focus on just the next sentence, not the whole chapter. Small steps add up.</li>
                <li><strong>Take a Walk:</strong> Physical movement often sparks creative insights. Some of the best ideas come during exercise.</li>
                <li><strong>Write Out of Order:</strong> Skip to a scene you're excited about. You can connect the pieces later.</li>
            </ul>
            
            <p>The most important thing? Don't wait for inspiration. Start writing anyway, and the words will follow. Action creates motivation, not the other way around.</p>
        `,
        relatedArticles: ['article-6', 'article-9', 'article-12']
    },
    {
        id: 'article-5',
        title: 'Creating Characters Readers Will Never Forget',
        slug: 'creating-unforgettable-characters',
        category: 'Writing Craft',
        author: 'Lisa Anderson',
        authorBio: 'Lisa Anderson is the author of 15 novels and a character development expert.',
        authorImg: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop',
        date: '2026-02-02',
        dateFormatted: 'February 2, 2026',
        readTime: '9 min read',
        image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=220&fit=crop',
        imageAlt: 'Stack of books',
        excerpt: 'Memorable characters are the heart of any great story. Learn the psychology behind creating believable characters.',
        tags: ['characters', 'fiction', 'development'],
        featured: false,
        views: 10234,
        content: `
            <p>Memorable characters are the heart of any great story. Learn the psychology behind creating believable, relatable, and compelling characters that resonate with readers long after they finish your book. Characters are what readers remember years after they've forgotten plot details.</p>
            
            <p>Think about the books that have moved you. Chances are, it's the characters who stayed with you—their struggles, growth, and humanity. Creating such characters requires understanding both human psychology and the craft of bringing fictional people to life on the page.</p>
            
            <h2>Character Fundamentals</h2>
            <p>Great characters need certain elements to feel real and compelling. These building blocks form the foundation of memorable characterization:</p>
            
            <ul>
                <li><strong>Clear motivations:</strong> What does your character want? What are they afraid of? These drive every decision.</li>
                <li><strong>Contradictions:</strong> Real people are complex. Give your characters traits that seemingly conflict.</li>
                <li><strong>Specific details:</strong> Small, concrete details make characters feel real. Not just "she's nervous," but how that manifests.</li>
                <li><strong>Growth potential:</strong> Characters should change throughout the story. What's their arc?</li>
                <li><strong>Authentic voice:</strong> Each character should speak and think in a distinct way.</li>
            </ul>
            
            <h2>The Iceberg Principle</h2>
            <p>Know more about your character than ever appears on the page. Their backstory, fears, hopes, habits, and secrets should be detailed in your notes—even if readers never see most of it. This depth informs everything they do and say.</p>
            
            <p>Create character profiles that include their childhood memories, biggest regrets, daily routines, favorite foods, and hidden talents. None of this may make it into the book, but it'll inform how you write them.</p>
            
            <h2>Techniques for Depth</h2>
            <ul>
                <li>Give them a distinctive speech pattern—perhaps they use certain phrases or interrupt often.</li>
                <li>Include specific physical habits—maybe they twirl their hair when anxious.</li>
                <li>Show their worldview through actions, not exposition.</li>
                <li>Create meaningful relationships that reveal different facets of their personality.</li>
                <li>Give them goals that matter deeply and obstacles that challenge them.</li>
            </ul>
            
            <p>When readers can visualize your character walking down the street—who they are, how they move, what they're thinking—you've succeeded in creating a truly memorable character.</p>
        `,
        relatedArticles: ['featured-1', 'article-1', 'article-8']
    },
    {
        id: 'article-6',
        title: 'Building a Sustainable Writing Routine That Sticks',
        slug: 'sustainable-writing-routine',
        category: 'Motivation',
        author: 'Rachel Green',
        authorBio: 'Rachel Green is a productivity coach specifically for writers. She has helped over 1,000 authors complete their manuscripts.',
        authorImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
        date: '2026-01-30',
        dateFormatted: 'January 30, 2026',
        readTime: '6 min read',
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=220&fit=crop',
        imageAlt: 'Team meeting',
        excerpt: 'Consistency is key to finishing your book. Learn how successful authors structure their day.',
        tags: ['routine', 'habits', 'productivity'],
        featured: false,
        views: 9234,
        content: `
            <p>Consistency is key to finishing your book. Learn how successful authors structure their day and maintain momentum without burning out. A sustainable routine turns writing from a sporadic activity into a reliable practice.</p>
            
            <p>The authors who finish books aren't necessarily more talented—they've just built systems that work. They show up regularly, even when they don't feel like it. And so can you.</p>
            
            <h2>Finding Your Peak Hours</h2>
            <p>Identify when you're most creative. Are you a morning person who writes best at sunrise, or do your creative juices flow late at night? Schedule your writing time during your peak hours, and protect that time fiercely.</p>
            
            <p>Pay attention to your energy patterns for a week. Note when you feel most alert and focused. Then, experiment with scheduling writing during those windows. You'll be surprised how much more you can accomplish.</p>
            
            <h2>The Power of Small Goals</h2>
            <p>Instead of aiming for 2,000 words daily, try starting with just 500. Small, achievable goals build momentum and confidence. The key is starting small enough that you can't fail, then gradually increasing as the habit strengthens.</p>
            
            <blockquote>"A writer is someone for whom writing is more difficult than it is for other people." — Thomas Mann</blockquote>
            
            <p>Celebrate small wins. Finished 500 words? That's success. Over time, those small victories compound into a completed manuscript.</p>
            
            <h2>Creating Triggers</h2>
            <p>Associate your writing time with specific cues that signal your brain it's time to create:</p>
            
            <ul>
                <li>Same time each day builds a habit loop.</li>
                <li>Same location creates a mental workspace.</li>
                <li>Same beverage (tea, coffee) can become a trigger.</li>
                <li>Same music or ambient sound signals creativity.</li>
                <li>A specific pre-writing ritual (stretching, meditation) can help.</li>
            </ul>
            
            <p>Over time, these triggers signal your brain that it's time to create, making it easier to start writing even on difficult days.</p>
        `,
        relatedArticles: ['article-4', 'article-12']
    },
    {
        id: 'article-7',
        title: 'The Complete Guide to Marketing Your First Book',
        slug: 'marketing-first-book-guide',
        category: 'Author Success',
        author: 'Tom Harrison',
        authorBio: 'Tom Harrison is a bestselling author and marketing strategist. He runs a marketing agency specifically for authors.',
        authorImg: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
        date: '2026-01-28',
        dateFormatted: 'January 28, 2026',
        readTime: '12 min read',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=220&fit=crop',
        imageAlt: 'Marketing analytics',
        excerpt: 'Writing the book is only half the battle. Discover effective marketing strategies that deliver real results.',
        tags: ['marketing', 'promotion', 'platform'],
        featured: false,
        views: 11234,
        content: `
            <p>Writing the book is only half the battle. Discover effective marketing strategies that don't require a massive budget but deliver real results. In today's publishing landscape, authors must be active participants in their own marketing.</p>
            
            <p>The good news? You don't need a big budget to market effectively. What you need is strategy, consistency, and genuine connection with readers. Here's how to build your author platform from scratch.</p>
            
            <h2>Building Your Author Platform</h2>
            <p>Before your book releases, establish your online presence. This platform is your home base for connecting with readers and promoting your work:</p>
            
            <ul>
                <li><strong>Author website:</strong> Create a professional website with a mailing list signup. This is your most important asset.</li>
                <li><strong>Social media presence:</strong> Choose 1-2 platforms where your readers spend time. Don't try to be everywhere.</li>
                <li><strong>Blog or newsletter:</strong> Share writing tips, behind-the-scenes content, and personal stories.</li>
                <li><strong>Engagement in writing communities:</strong> Build relationships with other authors and readers.</li>
            </ul>
            
            <h2>Pre-Launch Strategies</h2>
            <p>The months before publication are crucial for building momentum:</p>
            
            <ul>
                <li>Build an advance reader team of loyal fans who'll review on launch day.</li>
                <li>Gather early reviews from bloggers, influencers, and industry contacts.</li>
                <li>Create a book trailer—a short video that showcases your book.</li>
                <li>Set up Amazon pre-order to start building sales momentum.</li>
                <li>Create eye-catching graphics for social media promotion.</li>
            </ul>
            
            <h2>Post-Launch Marketing</h2>
            <p>Marketing doesn't stop at launch. Continue building relationships, seeking reviews, and promoting your backlist as you publish more books. A book's lifespan can be years if you invest in ongoing promotion.</p>
            
            <p>Remember: marketing is about serving readers, not just selling books. Provide value, build genuine relationships, and the sales will follow.</p>
        `,
        relatedArticles: ['article-3', 'article-11']
    },
    {
        id: 'article-8',
        title: 'Writing Dialogue That Sounds Natural and Engaging',
        slug: 'writing-natural-dialogue',
        category: 'Writing Craft',
        author: 'Amy Torres',
        authorBio: 'Amy Torres is an award-winning screenwriter and dialogue coach.',
        authorImg: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
        date: '2026-01-26',
        dateFormatted: 'January 26, 2026',
        readTime: '8 min read',
        image: 'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=400&h=220&fit=crop',
        imageAlt: 'Script pages',
        excerpt: 'Great dialogue reveals character, advances the plot, and keeps readers engaged.',
        tags: ['dialogue', 'craft', 'fiction'],
        featured: false,
        views: 7823,
        content: `
            <p>Great dialogue reveals character, advances the plot, and keeps readers engaged. Master the art of writing conversations that feel authentic and purposeful. Dialogue is one of the most powerful tools in your storytelling arsenal—it can do the work of pages of narration.</p>
            
            <p>When dialogue works, readers don't just hear characters speak—they understand them. Every line should reveal something about who they are, what they want, or the world they inhabit. Bad dialogue feels flat and functional. Great dialogue sings.</p>
            
            <h2>The Rules of Natural Dialogue</h2>
            <p>Understanding these fundamentals will transform your dialogue from serviceable to spectacular:</p>
            
            <ul>
                <li>People rarely say exactly what they mean—they deflect, avoid, and speak in circles.</li>
                <li>Conversations have subtext—what's left unsaid is often more important.</li>
                <li>Characters interrupt, trail off, and change subjects mid-thought.</li>
                <li>Not every line needs to be significant—real conversations have filler.</li>
                <li>Dialogue should sound different for each character based on their background.</li>
            </ul>
            
            <h2>Avoiding Dialogue Pitfalls</h2>
            <p>Watch out for these common mistakes that can make your dialogue feel unnatural:</p>
            
            <ul>
                <li>Don't have characters say what they could show through action.</li>
                <li>Avoid exposition dumps—don't use dialogue to explain things the reader already knows.</li>
                <li>Don't use dialogue tags that are redundant ("said" is almost always fine).</li>
                <li>Steer clear of on-the-nose conversations where characters state exactly what they mean.</li>
                <li>Don't have characters speak in perfect, complete sentences all the time.</li>
            </ul>
            
            <h2>The Reading Aloud Test</h2>
            <p>The best test for dialogue? Read it aloud. If it sounds awkward in your mouth, it will sound awkward on the page. Your ear will catch problems your eyes miss. Pay attention to rhythm, repetition, and natural speech patterns.</p>
            
            <p>Practice by listening to conversations around you—in coffee shops, on public transit. Notice how people really speak: the fragments, the interruptions, the meaning behind the words.</p>
        `,
        relatedArticles: ['article-1', 'article-5']
    },
    {
        id: 'article-9',
        title: 'Dealing with Rejection: How Successful Authors Keep Going',
        slug: 'dealing-with-rejection',
        category: 'Motivation',
        author: 'Mark Wilson',
        authorBio: 'Mark Wilson is a motivational speaker and author who has overcome 200+ rejections.',
        authorImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        date: '2026-01-24',
        dateFormatted: 'January 24, 2026',
        readTime: '7 min read',
        image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=220&fit=crop',
        imageAlt: 'Mountain climber',
        excerpt: 'Every successful author has faced rejection. Learn how to develop resilience and maintain your confidence.',
        tags: ['rejection', 'resilience', 'mindset'],
        featured: false,
        views: 14567,
        content: `
            <p>Every successful author has faced rejection. Learn how to develop resilience, maintain your confidence, and use feedback constructively to improve your work. Rejection is not the opposite of success—it's part of the journey.</p>
            
            <p>The path to publication is littered with nos. J.K. Rowling was rejected by 12 publishers. Stephen King's Carrie was rejected multiple times. Every bestselling author has a rejection story. What separates successful authors from those who give up is their response to rejection.</p>
            
            <blockquote>"Rejection is just a part of the process. The only way to guarantee rejection is to never try." — Nora Roberts</blockquote>
            
            <h2>The Reality of Rejection</h2>
            <p>Understanding what rejection really means can help you process it:</p>
            
            <ul>
                <li>Rejection often has nothing to do with your talent.</li>
                <li>Agents and editors have limited slots and specific tastes.</li>
                <li>A "no" today might become a "yes" from a different person tomorrow.</li>
                <li>Many great books were rejected before finding their home.</li>
                <li>Your manuscript might need revision, but that doesn't mean it's not publishable.</li>
            </ul>
            
            <h2>Developing Resilience</h2>
            <p>Build these mental habits to survive—and eventually thrive—through the rejection process:</p>
            
            <ul>
                <li><strong>Separate yourself from your work:</strong> Criticism of your manuscript isn't criticism of you.</li>
                <li><strong>View rejection as feedback:</strong> Look for helpful bits in rejection letters.</li>
                <li><strong>Remember: one "no" is just one opinion:</strong> Different agents have different tastes.</li>
                <li><strong>Keep writing regardless:</strong> Don't let rejection stop your creative output.</li>
                <li><strong>Build a support system:</strong> Connect with other writers who understand the journey.</li>
            </ul>
            
            <p>Let rejection fuel your determination rather than defeat your spirit. Every published author has been where you are. The only difference between them and those who gave up is persistence.</p>
        `,
        relatedArticles: ['article-4', 'article-6', 'article-12']
    },
    {
        id: 'article-10',
        title: 'Mastering the Three-Act Structure for Compelling Narratives',
        slug: 'three-act-structure-mastery',
        category: 'Writing Craft',
        author: 'Jennifer Lee',
        authorBio: 'Jennifer Lee is a screenwriter and story consultant. She developed the story structure curriculum at Disney Animation.',
        authorImg: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop',
        date: '2026-01-22',
        dateFormatted: 'January 22, 2026',
        readTime: '11 min read',
        image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&h=220&fit=crop',
        imageAlt: 'Story board',
        excerpt: 'The three-act structure is the foundation of storytelling. Understand how to pace your story.',
        tags: ['structure', 'plot', 'pacing'],
        featured: false,
        views: 11834,
        content: `
            <p>The three-act structure is the foundation of storytelling across all genres. Understand how to pace your story and create satisfying arcs that keep readers turning pages. This ancient framework remains the most effective way to create satisfying narratives.</p>
            
            <p>While some writers resist structure, thinking it limits creativity, the opposite is true. Structure gives you a framework to hang your creative ideas on. It provides readers with the rhythm they expect—and satisfying that expectation is deeply rewarding.</p>
            
            <h2>Act One: Setup (Approximately 25% of your story)</h2>
            <p>This act establishes everything readers need to understand the journey ahead:</p>
            
            <ul>
                <li><strong>Introduce your protagonist:</strong> Who is your main character? What makes them interesting?</li>
                <li><strong>Establish the status quo:</strong> What's normal for your character before the story begins?</li>
                <li><strong>Present the inciting incident:</strong> What event disrupts the status quo and launches the story?</li>
                <li><strong>Cross the threshold:</strong> Your protagonist commits to the journey into Act Two.</li>
            </ul>
            
            <p>The first act should hook readers with an interesting character in an interesting world, then upend that world in a way that demands resolution.</p>
            
            <h2>Act Two: Confrontation (Approximately 50% of your story)</h2>
            <p>This is where the bulk of your story happens. The protagonist faces obstacles and grows:</p>
            
            <ul>
                <li><strong>Rising complications:</strong> Problems get bigger and more complex.</li>
                <li><strong>Midpoint reversal:</strong> A major revelation or event shifts the story's direction.</li>
                <li><strong>Allies and enemies emerge:</strong> Characters who help or hinder the protagonist appear.</li>
                <li><strong>Approach the lowest point:</strong> Things seem darkest just before the climax.</li>
            </ul>
            
            <p>The second act is the longest because it's where your character truly transforms. Keep the stakes rising and the obstacles mounting.</p>
            
            <h2>Act Three: Resolution (Approximately 25% of your story)</h2>
            <p>Bring your story home with a satisfying conclusion:</p>
            
            <ul>
                <li><strong>Final challenge emerges:</strong> The ultimate test for your protagonist.</li>
                <li><strong>Climax reaches peak intensity:</strong> The story's highest point of tension.</li>
                <li><strong>Story resolves:</strong> All threads are tied up.</li>
                <li><strong>New normal is established:</strong> We see how the protagonist has changed.</li>
            </ul>
            
            <p>While this structure is ancient, it remains the most effective way to create satisfying stories. Master it, then find creative ways to work within it.</p>
        `,
        relatedArticles: ['featured-1', 'article-2']
    },
    {
        id: 'article-11',
        title: 'Crafting a Query Letter That Gets Noticed by Agents',
        slug: 'query-letter-guide',
        category: 'Industry Insights',
        author: 'Robert Garcia',
        authorBio: 'Robert Garcia is a literary agent with 15 years of experience.',
        authorImg: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        date: '2026-01-20',
        dateFormatted: 'January 20, 2026',
        readTime: '10 min read',
        image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&h=220&fit=crop',
        imageAlt: 'Business letter',
        excerpt: 'Your query letter is your first impression with literary agents. Learn what to include and avoid.',
        tags: ['query', 'agents', 'submission'],
        featured: false,
        views: 9876,
        content: `
            <p>Your query letter is your first impression with literary agents. Learn what to include, what to avoid, and how to make your manuscript stand out from the stack. This single page can determine whether your book gets read or rejected.</p>
            
            <p>Agents spend an average of 30 seconds reading a query letter. You need to hook them immediately and clearly convey why your book deserves their attention. Here's how to do that.</p>
            
            <h2>Query Letter Components</h2>
            <p>Every successful query includes these essential elements:</p>
            
            <ul>
                <li><strong>Personalization:</strong> Address the agent by name. Never use "Dear Sir/Madam."</li>
                <li><strong>The Hook:</strong> Start with a compelling opening that grabs attention.</li>
                <li><strong>Book Info:</strong> Include title, word count, and genre.</li>
                <li><strong>Synopsis:</strong> Present your plot summary focusing on the main conflict and stakes.</li>
                <li><strong>Credentials:</strong> Share relevant writing experience and qualifications.</li>
                <li><strong>Closing:</strong> Thank them for their time and consideration.</li>
            </ul>
            
            <p>Your synopsis paragraph is the heart of the query. It should convey the tone of your book, introduce your protagonist, present the central conflict, and hint at the stakes—all in a few sentences.</p>
            
            <h2>Common Mistakes</h2>
            <p>Avoid these errors that cause agents to reject queries immediately:</p>
            
            <ul>
                <li>Starting with "Dear Sir/Madam"—always personalize.</li>
                <li>Comparing yourself to famous authors—"the next J.K. Rowling."</li>
                <li>Revealing the ending—don't spoil your plot.</li>
                <li>Being too vague about your plot—"then many exciting things happen."</li>
                <li>Writing a long, dense paragraph—keep it scannable.</li>
                <li>Forgetting to mention word count.</li>
            </ul>
            
            <p>Research each agent thoroughly and personalize every query. Generic letters get rejected. When you demonstrate you know what the agent is looking for, you stand out.</p>
        `,
        relatedArticles: ['article-3', 'article-7']
    },
    {
        id: 'article-12',
        title: 'Why Every Writer Needs a Supportive Community',
        slug: 'writer-community-support',
        category: 'Motivation',
        author: 'Maria Santos',
        authorBio: 'Maria Santos is the founder of Writers United, a community of over 50,000 writers.',
        authorImg: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop',
        date: '2026-01-18',
        dateFormatted: 'January 18, 2026',
        readTime: '5 min read',
        image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=220&fit=crop',
        imageAlt: 'Group of writers',
        excerpt: 'Writing can be lonely, but it doesn\'t have to be. Discover the benefits of joining writing groups.',
        tags: ['community', 'support', 'networking'],
        featured: false,
        views: 7654,
        content: `
            <p>Writing can be lonely, but it doesn't have to be. Discover the benefits of joining writing groups and how to find your tribe of like-minded creatives. The writing journey is challenging, but you don't have to walk it alone.</p>
            
            <p>Many writers imagine themselves as solitary figures, toiling away in isolation. While writing is often a solitary activity, the writing life doesn't have to be lonely. Finding a community of fellow writers can transform your experience—and your work.</p>
            
            <h2>Benefits of Community</h2>
            <p>Being part of a writing community offers numerous advantages:</p>
            
            <ul>
                <li><strong>Accountability:</strong> Having others expecting your work helps you meet deadlines.</li>
                <li><strong>Emotional support:</strong> Writers understand the unique challenges you face.</li>
                <li><strong>Feedback:</strong> Beta readers and critique partners help improve your work.</li>
                <li><strong>Networking:</strong> Connections can lead to opportunities and collaborations.</li>
                <li><strong>Learning:</strong> You'll grow faster by learning from others' experiences.</li>
                <li><strong>Motivation:</strong> Seeing others succeed can inspire you to keep going.</li>
            </ul>
            
            <blockquote>"Alone, we can do so little; together, we can do so much." — Helen Keller</blockquote>
            
            <h2>Finding Your Tribe</h2>
            <p>There are many ways to connect with other writers:</p>
            
            <ul>
                <li><strong>Local writing groups:</strong> Check libraries, bookstores, and community centers.</li>
                <li><strong>Online communities:</strong> Forums, Discord servers, and social media groups.</li>
                <li><strong>Writing conferences:</strong> Great for networking and learning.</li>
                <li><strong>Workshop courses:</strong> Many MFA programs and community colleges offer them.</li>
                <li><strong>Critique partners:</strong> Find one or two writers at your level for exchange.</li>
            </ul>
            
            <p>The writing journey is challenging, but you don't have to walk it alone. Find your people—they'll make the journey richer and more rewarding.</p>
        `,
        relatedArticles: ['article-6', 'article-4', 'article-9']
    }
];

const MOCK_CATEGORIES = [
    { id: 'writing-craft', name: 'Writing Craft', slug: 'writing-craft', count: 5 },
    { id: 'script-writing', name: 'Script Writing', slug: 'script-writing', count: 1 },
    { id: 'author-success', name: 'Author Success', slug: 'author-success', count: 2 },
    { id: 'motivation', name: 'Motivation', slug: 'motivation', count: 3 },
    { id: 'industry-insights', name: 'Industry Insights', slug: 'industry-insights', count: 1 }
];

// Comments data with nested replies
const MOCK_COMMENTS = {
    'featured-1': [
        {
            id: 'comment-1',
            articleId: 'featured-1',
            authorName: 'Emily Watson',
            authorEmail: 'emily@example.com',
            content: 'This is exactly what I needed! I\'ve been struggling with my opening chapter for weeks. The tip about starting with action really helped. I rewrote my opening scene and it finally feels right.',
            createdAt: '2026-02-10T10:30:00Z',
            status: 'approved',
            parentId: null,
            replies: [
                {
                    id: 'comment-1-1',
                    articleId: 'featured-1',
                    authorName: 'James Mitchell',
                    authorEmail: 'james@example.com',
                    content: 'So glad it helped, Emily! The opening is often the hardest part to get right. Feel free to share your new opening if you\'d like feedback!',
                    createdAt: '2026-02-10T14:22:00Z',
                    status: 'approved',
                    parentId: 'comment-1',
                    replies: []
                }
            ]
        },
        {
            id: 'comment-2',
            articleId: 'featured-1',
            authorName: 'Michael Torres',
            authorEmail: 'michael@example.com',
            content: 'Great article! I\'ve been writing for 5 years and still find openings difficult. One thing I\'d add is that sometimes the best opening is written last—after you know your whole story.',
            createdAt: '2026-02-09T16:45:00Z',
            status: 'approved',
            parentId: null,
            replies: []
        },
        {
            id: 'comment-3',
            articleId: 'featured-1',
            authorName: 'Sarah Miller',
            authorEmail: 'sarah@example.com',
            content: 'The section on common mistakes was eye-opening. I realized I\'ve been starting most of my stories with weather descriptions! Time for a rewrite.',
            createdAt: '2026-02-08T09:15:00Z',
            status: 'approved',
            parentId: null,
            replies: [
                {
                    id: 'comment-3-1',
                    articleId: 'featured-1',
                    authorName: 'David Park',
                    authorEmail: 'david@example.com',
                    content: 'Haha, you\'re not alone! Weather is one of the most common crutches. Once you recognize it, it\'s easier to avoid.',
                    createdAt: '2026-02-08T11:30:00Z',
                    status: 'approved',
                    parentId: 'comment-3',
                    replies: []
                }
            ]
        }
    ],
    'article-1': [
        {
            id: 'comment-4',
            articleId: 'article-1',
            authorName: 'Jennifer Adams',
            authorEmail: 'jennifer@example.com',
            content: 'Finding my voice has been quite a journey. This article validates what I\'ve been feeling—that authenticity matters more than following formulas.',
            createdAt: '2026-02-05T13:20:00Z',
            status: 'approved',
            parentId: null,
            replies: []
        }
    ],
    'article-4': [
        {
            id: 'comment-5',
            articleId: 'article-4',
            authorName: 'Robert Chen',
            authorEmail: 'robert@example.com',
            content: 'Writer\'s block hit me hard last month. The freewriting technique really helped me break through. Thanks for sharing these evidence-based strategies!',
            createdAt: '2026-02-01T08:45:00Z',
            status: 'approved',
            parentId: null,
            replies: []
        }
    ],
    'article-9': [
        {
            id: 'comment-6',
            articleId: 'article-9',
            authorName: 'Lisa Thompson',
            authorEmail: 'lisa@example.com',
            content: 'This came at the perfect time. I just received my 15th rejection letter this week. Needed this reminder that persistence pays off.',
            createdAt: '2026-01-20T15:30:00Z',
            status: 'approved',
            parentId: null,
            replies: [
                {
                    id: 'comment-6-1',
                    articleId: 'article-9',
                    authorName: 'Mark Wilson',
                    authorEmail: 'mark@example.com',
                    content: '15 rejections is tough, but it\'s not unusual. Keep going—your breakthrough is coming!',
                    createdAt: '2026-01-20T17:00:00Z',
                    status: 'approved',
                    parentId: 'comment-6',
                    replies: []
                }
            ]
        }
    ]
};

const SIMULATE_DELAY = 200;

// ============================================
// API CONFIGURATION
// ============================================

const API_CONFIG = {
    USE_MOCK_API: false,
    BASE_URL: 'http://localhost:3001',
    ENDPOINTS: {
        articles: '/api/articles',
        categories: '/api/categories',
        newsletter: '/api/newsletter/subscribe',
        search: '/api/articles/search',
        comments: '/api/articles/:id/comments',
        books: '/api/books',
        bookSpotlight: '/api/books/spotlight'
    }
};

// ============================================
// API FUNCTIONS
// ============================================

async function mockApiRequest(endpoint, options = {}) {
    await new Promise(resolve => setTimeout(resolve, SIMULATE_DELAY));
    
    const url = new URL(endpoint, 'http://localhost:3001');
    const params = url.searchParams;
    const pathname = url.pathname;
    
    // GET /api/books
    if (pathname === '/api/books' && (!options.method || options.method === 'GET')) {
        // We can reuse MOCK_ARTICLES pattern or create MOCK_BOOKS if we want,
        // but for now let's just use the books from book-discovery.js if they were here.
        // For simplicity, let's just return a success with empty data or some defaults
        return { success: true, data: [], pagination: { total: 0 } };
    }

    // GET /api/articles
    if (pathname === '/api/articles' && (!options.method || options.method === 'GET')) {
        let articles = [...MOCK_ARTICLES];
        
        const category = params.get('category');
        if (category) {
            articles = articles.filter(a => a.category.toLowerCase().replace(/ /g, '-') === category.toLowerCase());
        }
        
        const featured = params.get('featured');
        if (featured === 'true') {
            articles = articles.filter(a => a.featured);
        }
        
        const search = params.get('q');
        if (search) {
            const searchLower = search.toLowerCase();
            articles = articles.filter(a => 
                a.title.toLowerCase().includes(searchLower) ||
                a.excerpt.toLowerCase().includes(searchLower) ||
                a.tags.some(tag => tag.toLowerCase().includes(searchLower))
            );
        }
        
        articles.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        const page = parseInt(params.get('page')) || 1;
        const limit = parseInt(params.get('limit')) || 12;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        
        const paginatedArticles = articles.slice(startIndex, endIndex);
        
        return {
            success: true,
            data: paginatedArticles,
            pagination: {
                page,
                limit,
                total: articles.length,
                totalPages: Math.ceil(articles.length / limit),
                hasMore: endIndex < articles.length
            }
        };
    }
    
    // GET /api/articles/:id
    const articleMatch = pathname.match(/^\/api\/articles\/(.+)$/);
    if (articleMatch) {
        const articleId = articleMatch[1];
        const article = MOCK_ARTICLES.find(a => a.id === articleId);
        
        if (article) {
            return { success: true, data: article };
        } else {
            return { success: false, error: 'Article not found', status: 404 };
        }
    }
    
    // GET /api/categories
    if (pathname === '/api/categories') {
        return { success: true, data: MOCK_CATEGORIES };
    }
    
    // GET /api/articles/:id/comments
    const commentsMatch = pathname.match(/^\/api\/articles\/(.+)\/comments$/);
    if (commentsMatch) {
        const articleId = commentsMatch[1];
        const comments = MOCK_COMMENTS[articleId] || [];
        
        // Get only approved comments
        const approvedComments = comments.filter(c => c.status === 'approved');
        
        return { 
            success: true, 
            data: approvedComments,
            total: approvedComments.length
        };
    }
    
    // POST /api/newsletter/subscribe
    if (pathname === '/api/newsletter/subscribe' && options.method === 'POST') {
        return { success: true, message: 'Successfully subscribed' };
    }
    
    // POST /api/articles/:id/comments
    if (pathname.match(/^\/api\/articles\/.+\/comments$/) && options.method === 'POST') {
        const body = options.body ? JSON.parse(options.body) : {};
        
        // Create new comment
        const newComment = {
            id: 'comment-' + Date.now(),
            articleId: pathname.match(/^\/api\/articles\/(.+)\/comments$/)[1],
            authorName: body.authorName,
            authorEmail: body.authorEmail,
            content: body.content,
            createdAt: new Date().toISOString(),
            status: 'pending', // Requires admin approval
            parentId: body.parentId || null,
            replies: []
        };
        
        // Save to mock database
        if (body.parentId) {
            // It's a reply - find parent and add to replies
            const articleComments = MOCK_COMMENTS[newComment.articleId] || [];
            const parentComment = articleComments.find(c => c.id === body.parentId);
            if (parentComment) {
                parentComment.replies.push(newComment);
            }
        } else {
            // Top-level comment
            if (!MOCK_COMMENTS[newComment.articleId]) {
                MOCK_COMMENTS[newComment.articleId] = [];
            }
            MOCK_COMMENTS[newComment.articleId].push(newComment);
        }
        
        return { 
            success: true, 
            message: 'Comment submitted! It will appear after approval.',
            data: newComment
        };
    }
    
    return { success: false, error: 'Endpoint not found', status: 404 };
}

async function apiRequest(endpoint, options = {}) {
    if (API_CONFIG.USE_MOCK_API) {
        return mockApiRequest(endpoint, options);
    }
    
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options.headers
            }
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // If no articles found, fall back to mock data for articles endpoints
        if ((endpoint.includes('/api/articles') || endpoint.includes('/api/categories')) && 
            data && (data.articles === undefined || data.articles?.length === 0)) {
            console.log('No data from API, falling back to mock data for:', endpoint);
            return mockApiRequest(endpoint, options);
        }
        
        return data;
    } catch (error) {
        console.error('API Request Failed:', error);
        // Fall back to mock data on error
        console.log('Falling back to mock data for:', endpoint);
        return mockApiRequest(endpoint, options);
    }
}

// ============================================
// PUBLIC API
// ============================================

async function fetchBooks(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/api/books?${query}`);
}

async function fetchBookSpotlight() {
    return apiRequest('/api/books/spotlight');
}

async function searchExternalBooks(q, maxResults = 10, startIndex = 0) {
    return apiRequest(`/api/external-books/search?q=${encodeURIComponent(q)}&maxResults=${maxResults}&startIndex=${startIndex}`);
}

async function fetchTrendingBooks(maxResults = 12) {
    return apiRequest(`/api/external-books/trending?maxResults=${maxResults}`);
}

async function fetchNewReleases(maxResults = 12) {
    return apiRequest(`/api/external-books/new-releases?maxResults=${maxResults}`);
}

async function fetchBooksByCategory(category, maxResults = 12, startIndex = 0) {
    return apiRequest(`/api/external-books/category/${encodeURIComponent(category)}?maxResults=${maxResults}&startIndex=${startIndex}`);
}

async function fetchBooksByAuthor(author, maxResults = 12) {
    return apiRequest(`/api/external-books/author/${encodeURIComponent(author)}?maxResults=${maxResults}`);
}

async function fetchRecommendedBooks(seed = 'fiction bestseller', maxResults = 12) {
    return apiRequest(`/api/external-books/recommended?seed=${encodeURIComponent(seed)}&maxResults=${maxResults}`);
}

async function fetchBookById(id) {
    return apiRequest(`/api/external-books/${encodeURIComponent(id)}`);
}

async function fetchFeaturedAuthors(maxResults = 4) {
    return apiRequest(`/api/authors/featured?maxResults=${maxResults}`);
}

async function searchAuthors(query) {
    return apiRequest(`/api/authors/search?q=${encodeURIComponent(query)}`);
}

// ============================================
// COMMUNITY API FUNCTIONS
// ============================================

async function fetchCommunityStats() {
    try {
        const response = await apiRequest('/api/community/stats');
        return response;
    } catch (err) {
        console.warn('Failed to fetch community stats, using fallback:', err);
        return {
            members: 15234,
            discussions: 3456,
            dailyPosts: 892
        };
    }
}

async function fetchDiscussions(category = 'all', page = 1, limit = 10) {
    try {
        const endpoint = category === 'all' 
            ? `/api/forum/posts?page=${page}&limit=${limit}`
            : `/api/forum/posts?category=${encodeURIComponent(category)}&page=${page}&limit=${limit}`;
        return await apiRequest(endpoint);
    } catch (err) {
        console.warn('Failed to fetch discussions, using fallback:', err);
        return getFallbackDiscussions();
    }
}

async function fetchPolls() {
    try {
        return await apiRequest('/api/polls');
    } catch (err) {
        console.warn('Failed to fetch polls, using fallback:', err);
        return { polls: getFallbackPolls() };
    }
}

async function voteOnPoll(pollId, optionId) {
    return apiRequest(`/api/polls/${pollId}/vote`, {
        method: 'POST',
        body: JSON.stringify({ option_id: optionId }),
        headers: { 'Content-Type': 'application/json' }
    });
}

async function fetchRecommendations(sort = 'popular') {
    try {
        return await apiRequest(`/api/recommendations?sort=${sort}`);
    } catch (err) {
        console.warn('Failed to fetch recommendations, using fallback:', err);
        return { recommendations: getFallbackRecommendations() };
    }
}

async function voteOnRecommendation(recId) {
    return apiRequest(`/api/recommendations/${recId}/vote`, {
        method: 'POST'
    });
}

async function addRecommendation(title, author, description) {
    return apiRequest('/api/recommendations', {
        method: 'POST',
        body: JSON.stringify({ title, author, description }),
        headers: { 'Content-Type': 'application/json' }
    });
}

async function fetchUpcomingMeetings() {
    try {
        return await apiRequest('/api/events?upcoming=true&limit=3');
    } catch (err) {
        console.warn('Failed to fetch meetings, using fallback:', err);
        return { events: getFallbackMeetings() };
    }
}

async function fetchChatMessages(room = 'general') {
    try {
        return await apiRequest(`/api/chat/${room}?limit=20`);
    } catch (err) {
        console.warn('Failed to fetch chat messages:', err);
        return { messages: [] };
    }
}

async function sendChatMessage(room, content) {
    return apiRequest(`/api/chat/${room}`, {
        method: 'POST',
        body: JSON.stringify({ content }),
        headers: { 'Content-Type': 'application/json' }
    });
}

async function createForumPost(title, content, category) {
    return apiRequest('/api/forum/posts', {
        method: 'POST',
        body: JSON.stringify({ title, content, category }),
        headers: { 'Content-Type': 'application/json' }
    });
}

async function fetchPostReplies(postId) {
    try {
        return await apiRequest(`/api/forum/posts/${postId}`);
    } catch (err) {
        console.warn('Failed to fetch post replies:', err);
        return { post: null, replies: [] };
    }
}

async function addForumReply(postId, content) {
    return apiRequest(`/api/forum/posts/${postId}/reply`, {
        method: 'POST',
        body: JSON.stringify({ content }),
        headers: { 'Content-Type': 'application/json' }
    });
}

// ============================================
// FALLBACK DATA
// ============================================

function getFallbackDiscussions() {
    return {
        posts: [
            {
                id: 'fallback-1',
                title: 'The ending of "The Unbreakable Spirit" brought me to tears',
                content: 'I just finished reading this month\'s pick and I\'m completely overwhelmed. The way Sarah writes about overcoming adversity through faith and community... Has anyone else felt this moved by a book?',
                category: 'Monthly Picks',
                author: { full_name: 'Sarah Mitchell', avatar_url: 'https://picsum.photos/seed/user1/50/50' },
                reply_count: 24,
                created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'fallback-2',
                title: 'Completed my first reading challenge!',
                content: 'I just finished reading 12 books this month! The "Triumphant Stories" challenge really pushed me to explore outside my comfort zone. What books helped you grow this year?',
                category: 'Reading Challenges',
                author: { full_name: 'Michael Torres', avatar_url: 'https://picsum.photos/seed/user2/50/50' },
                reply_count: 18,
                created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'fallback-3',
                title: 'Character analysis: Discussing resilience in "Against All Odds"',
                content: 'I\'m fascinated by how Jennifer Liu crafted such complex characters who face overwhelming odds yet find strength in community. The mother-daughter relationship particularly resonated with me.',
                category: 'Author Spotlights',
                author: { full_name: 'Jennifer Liu', avatar_url: 'https://picsum.photos/seed/user3/50/50' },
                reply_count: 42,
                created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'fallback-4',
                title: 'Monthly Theme: "Stories of Second Chances"',
                content: 'This month we\'re exploring how triumph isn\'t always about the first try. Share your stories of persistence, comebacks, and finding success after setbacks.',
                category: 'Triumph Stories',
                author: { full_name: 'Community Team', avatar_url: 'https://picsum.photos/seed/user4/50/50' },
                reply_count: 67,
                created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'fallback-5',
                title: 'AMA with Dr. Robert Chen - Ask Me Anything!',
                content: 'The author of "The Power Within" is joining us live to answer your questions about writing, psychology, and his journey of creating practical self-help content.',
                category: 'Monthly Picks',
                author: { full_name: 'Dr. Robert Chen', avatar_url: 'https://picsum.photos/seed/user5/50/50' },
                reply_count: 156,
                created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
            }
        ],
        pagination: { page: 1, total: 5, pages: 1 }
    };
}

function getFallbackPolls() {
    return [
        {
            id: 'poll-1',
            question: 'Which genre should we feature next month?',
            active: true,
            options: [
                { id: 'opt-1', text: 'Historical Fiction', votes: 45, percentage: 45 },
                { id: 'opt-2', text: 'Memoir & Biography', votes: 38, percentage: 38 },
                { id: 'opt-3', text: 'Science Fiction', votes: 17, percentage: 17 }
            ],
            total_votes: 100
        },
        {
            id: 'poll-2',
            question: 'What\'s your favorite reading time?',
            active: true,
            options: [
                { id: 'opt-4', text: 'Evening (6PM - 10PM)', votes: 52, percentage: 52 },
                { id: 'opt-5', text: 'Morning (5AM - 9AM)', votes: 31, percentage: 31 },
                { id: 'opt-6', text: 'Weekend Afternoons', votes: 17, percentage: 17 }
            ],
            total_votes: 100
        },
        {
            id: 'poll-3',
            question: 'How many books do you read per month?',
            active: true,
            options: [
                { id: 'opt-7', text: '2-3 books', votes: 34, percentage: 34 },
                { id: 'opt-8', text: '1-2 books', votes: 28, percentage: 28 },
                { id: 'opt-9', text: '4+ books', votes: 22, percentage: 22 },
                { id: 'opt-10', text: 'Less than 1', votes: 16, percentage: 16 }
            ],
            total_votes: 100
        }
    ];
}

function getFallbackRecommendations() {
    return [
        {
            id: 'rec-1',
            title: 'The Midnight Library',
            author: 'Matt Haig',
            description: 'A beautiful story about choices and parallel lives.',
            votes: 89,
            thumbnail: 'https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg'
        },
        {
            id: 'rec-2',
            title: 'Atomic Habits',
            author: 'James Clear',
            description: 'Life-changing book about building good habits.',
            votes: 76,
            thumbnail: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg'
        },
        {
            id: 'rec-3',
            title: 'Project Hail Mary',
            author: 'Andy Weir',
            description: 'Incredible sci-fi about survival and friendship.',
            votes: 65,
            thumbnail: 'https://covers.openlibrary.org/b/isbn/9780593135204-L.jpg'
        },
        {
            id: 'rec-4',
            title: 'The Four Agreements',
            author: 'Don Miguel Ruiz',
            description: 'Ancient wisdom for modern life.',
            votes: 54,
            thumbnail: 'https://covers.openlibrary.org/b/isbn/9780880885790-L.jpg'
        }
    ];
}

function getFallbackMeetings() {
    return [
        {
            id: 'meeting-1',
            title: 'Monthly Book Discussion',
            book_title: 'Rising from Ashes',
            book_author: 'Michael Torres',
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            time: '7:00 PM - 8:30 PM EST',
            attendees_count: 47
        },
        {
            id: 'meeting-2',
            title: 'Author Q&A Session',
            book_title: 'Live with Dr. Robert Chen',
            date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            time: '8:00 PM - 9:00 PM EST',
            attendees_count: 32
        }
    ];
}

function getFallbackCategories() {
    return [
        { id: 'all', name: 'All Categories', topic_count: 538, post_count: 4194 },
        { id: 'Monthly Picks', name: 'Monthly Picks', topic_count: 248, post_count: 1892 },
        { id: 'Reading Challenges', name: 'Reading Challenges', topic_count: 45, post_count: 623 },
        { id: 'Author Spotlights', name: 'Author Spotlights', topic_count: 89, post_count: 445 },
        { id: 'Triumph Stories', name: 'Triumph Stories', topic_count: 156, post_count: 1234 }
    ];
}

const CommunityAPI = {
    fetchCommunityStats,
    fetchDiscussions,
    fetchPolls,
    voteOnPoll,
    fetchRecommendations,
    voteOnRecommendation,
    addRecommendation,
    fetchUpcomingMeetings,
    fetchChatMessages,
    sendChatMessage,
    createForumPost,
    fetchPostReplies,
    addForumReply,
    getFallbackCategories,
    getFallbackDiscussions,
    getFallbackPolls,
    getFallbackRecommendations,
    getFallbackMeetings
};

const BlogAPI = {
    fetchArticles,
    fetchFeaturedArticle,
    fetchArticleById,
    fetchCategories,
    searchArticles,
    subscribeNewsletter,
    fetchRelatedArticles,
    trackArticleView,
    fetchComments,
    submitComment,
    fetchBooks,
    fetchBookSpotlight,
    searchExternalBooks,
    fetchTrendingBooks,
    fetchNewReleases,
    fetchBooksByCategory,
    fetchBooksByAuthor,
    fetchRecommendedBooks,
    fetchBookById,
    fetchFeaturedAuthors,
    searchAuthors,
    config: API_CONFIG,
    community: CommunityAPI
};

if (typeof globalThis.window !== 'undefined') {
    globalThis.window.BlogAPI = BlogAPI;
}
