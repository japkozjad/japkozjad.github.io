// Navbar

document.getElementById("navbar-items").innerHTML = `
    <button id="navbar-burger" class="navbar-burger" aria-label="Menu">
        <span></span>
        <span></span>
        <span></span>
    </button>
    <div class=navbar-links>
        <a href="/about-me.html" title="Let me tell you something about myself...">About Me</a>
        <a href="/characters.html" title="Meet my characters!">Characters</a>
        <a href="/music.html" title="I have some music :3">Music</a>
        <a href="/arts.html" title="Mostly ponies ^c^">Arts</a>
        <a href="/projects.html" title="I pretend that I know what I'm doing...">Projects</a>
        <a href="/packs.html" title="Samples, Presets and other stuff!">Packs</a>
        <a href="/contact.html" title="Get in touch.">Contact</a>
        <a href="https://discord.gg/UE6dz92Mgr" target="_blank" title="Join my Discord server!"><img src="/assets/site/logos/discord.svg" alt="Discord" width="24" height="24"></a>
    </div>
`;

setTimeout(() => {
    const burger = document.getElementById("navbar-burger");
    const links = document.querySelector(".navbar-links");

    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll(".navbar-links a");

    navLinks.forEach(link => {
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active");
        }
    });

    burger.addEventListener("click", () => {
        links.classList.toggle("show");
        burger.classList.toggle("show");
    });
}, 100);

// Footer

document.getElementById("footer-container").innerHTML = `
<div class="footer-content">
<a href="https://www.youtube.com/@japkozjad" target="_blank" title="Subscribe to my YouTube channel."><img src="/assets/site/logos/youtube.svg" alt="YouTube" width="24" height="24"></a>
<a href="https://www.instagram.com/japkozjad/" target="_blank" title="Follow me on Instagram."><img src="/assets/site/logos/instagram.svg" alt="Instagram" width="24" height="24"></a>
<a href="https://bsky.app/profile/japkozjad.bsky.social" target="_blank" title="Follow me on Bluesky."><img src="/assets/site/logos/bluesky.svg" alt="Bluesky" width="24" height="24"></a>
<a href="https://twitter.com/japkozjad" target="_blank" title="Follow me on X/Twitter."><img src="/assets/site/logos/x-twitter.svg" alt="Twitter" width="24" height="24"></a>
<a href="https://japkozjad.bandcamp.com/" target="_blank" title="Listen on Bandcamp."><img src="/assets/site/logos/bandcamp.svg" alt="Bandcamp" width="24" height="24"></a>
<a href="https://open.spotify.com/artist/1lfqAcPUFWB4PJG8RQ8CLy" target="_blank" title="Listen on Spotify."><img src="/assets/site/logos/spotify.svg" alt="Spotify" width="24" height="24"></a>
<a href="https://music.apple.com/us/artist/japkozjad/1655854950" target="_blank" title="Listen on Apple Music."><img src="/assets/site/logos/apple-music.svg" alt="Apple Music" width="24" height="24"></a>
<a href="https://discord.gg/UE6dz92Mgr" target="_blank" title="Join my Discord server!"><img src="/assets/site/logos/discord.svg" alt="Discord" width="24" height="24"></a>
</div>
`;

// Age calculation
function updateJapkozjadAge() {
    var currentDate = new Date();
    var mybirthdate = "2003-05-09";
    var birthDate = new Date(mybirthdate);
    var ageInMilliseconds = currentDate - birthDate;
    var ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
    var age = Math.floor(ageInYears);
    var mybirthDocElement = document.getElementById("myage");
    mybirthDocElement.textContent = age
}

function discographyGenerator() {
    const container = document.querySelector(".discography-container");
    if (!container) return;

    fetch('/discography/discography.json')
        .then(response => response.json())
        .then(data => {
            container.innerHTML = "";
            data.discography.forEach(track => {
                const coverSrc = track.image
                ? `/discography/covers/${track.image}`
                : `/discography/covers/blankart.jpg`;
            
            let linksHTML = "";
            if (track.streaming) {
                linksHTML += `<a href="${track.streaming}" target="_blank" title="Listen on Streaming Services"><img src="/assets/site/music-buttons/streaming.svg" alt="Streaming" width="24" height="24"></a>`;
            }
            if (track.youtube) {
                linksHTML += `<a href="${track.youtube}" target="_blank" title="Listen on YouTube"><img src="/assets/site/logos/youtube.svg" alt="YouTube" width="24" height="24"></a>`;
            }

            const albumCard = `
                <div class="music-track-card">
                    <div class="music-track-item">
                        <img draggable="false" src="${coverSrc}" alt="${track.title} Cover Art" class="music-track-cover">
                        <div class="music-track-links">
                            ${linksHTML}
                        </div>
                    </div>
                    <div class="music-track-info">
                        <div class="music-track-header">
                            <h2>${track.title}</h2>
                            <h3>by ${track.author}</h3>
                        </div>
                    </div>
                </div>
            `;

            container.innerHTML += albumCard;
            });
        })
        .catch(error => {
            console.error("Error loading discography:", error);
            container.innerHTML = "<p>Couldn't load discography. Try again later -c-</p>";
        });
}

// Derpibooru Image Fetcher
function derpibooruFetcher() {
    function createImageLink(image) {
        const imageLink = document.createElement('a');
        imageLink.href = `https://derpibooru.org/images/${image.id}`;
        imageLink.target = '_blank';

        const imageElement = document.createElement('img');
        imageElement.classList.add("derpi_img");
        imageElement.src = image.representations.medium;
        imageElement.alt = `Image ${image.id}`;

        imageLink.appendChild(imageElement);

        return imageLink;
    }

    document.addEventListener("DOMContentLoaded", function() {
                        fetch('https://derpibooru.org/api/v1/json/search/images?per_page=20&q=safe%2C+artist%3Ajapkozjad%2C+-webm')
                        .then(response => response.json())
                        .then(data => {
                            const images = data.images;
                            if (images && images.length > 0) {
                                const imageContainer = document.getElementById('derpibooru-container');
                                if (imageContainer) {
                                    images.forEach(image => {
                                        const imageLink = createImageLink(image);
                                        imageLink.classList.add("derpi_img_link");

                                        const imageLinkContainer = document.createElement('div');
                                        imageLinkContainer.classList.add("derpi_img_container");
                                        imageLinkContainer.appendChild(imageLink);

                                        imageContainer.appendChild(imageLinkContainer);
                                    });
                                }
                            }
                        });
                    });
}

// Character Slideshow
function characterSlideshow() {
    document.addEventListener("DOMContentLoaded", () => {
    const galleryContainer = document.getElementById("character-slideshow-gallery");
    if (!galleryContainer) return;

    const mainImg = document.getElementById("slideshow-current-img");
    const counter = document.getElementById("slideshow-counter");
    const caption = document.getElementById("slideshow-caption-text");
    const thumbsContainer = document.getElementById("slideshow-thumbnails-container");
    const prevBtn = document.getElementById("slide-prev-btn");
    const nextBtn = document.getElementById("slide-next-btn");
    const mainArea = galleryContainer.querySelector(".slideshow-main-area");

    const pathSegments = window.location.pathname.split("/");
    const htmlFilename = pathSegments[pathSegments.length - 1];
    const characterName = htmlFilename.replace(".html", "");

    const galleryPath = `/characters/${characterName}/gallery/`;
    const jsonUrl = `${galleryPath}gallery.json`;

    let currentIndex = 0;
    let galleryImages = [];
    let touchStartX = 0;
    let touchEndX = 0;

    function updateSlideshow() {
        if (galleryImages.length === 0) return;

        const currentData = galleryImages[currentIndex];
        mainImg.src = `${galleryPath}${currentData.filename}`;
        mainImg.alt = currentData.title || "";
        mainImg.draggable = false;
        
        counter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
        caption.textContent = currentData.title || "";

        const allThumbs = thumbsContainer.querySelectorAll(".thumb-item");
        allThumbs.forEach((thumb, index) => {
            if (index === currentIndex) {
                thumb.classList.add("active");
            } else {
                thumb.classList.remove("active");
            }
        });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                currentIndex = (currentIndex === galleryImages.length - 1) ? 0 : currentIndex + 1;
            } else {
                currentIndex = (currentIndex === 0) ? galleryImages.length - 1 : currentIndex - 1;
            }
            updateSlideshow();
        }
    }

    mainArea.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    mainArea.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    mainArea.addEventListener("mousedown", (e) => {
        touchStartX = e.screenX;
    });

    mainArea.addEventListener("mouseup", (e) => {
        touchEndX = e.screenX;
        handleSwipe();
    });

    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex === 0) ? galleryImages.length - 1 : currentIndex - 1;
        updateSlideshow();
    });

    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex === galleryImages.length - 1) ? 0 : currentIndex + 1;
        updateSlideshow();
    });

    fetch(jsonUrl)
        .then(response => {
            if (!response.ok) throw new Error();
            return response.json();
        })
        .then(images => {
            galleryImages = images;
            if (galleryImages.length === 0) return;

            thumbsContainer.innerHTML = "";
            galleryImages.forEach((image, index) => {
                const thumb = document.createElement("div");
                thumb.className = "thumb-item";
                
                const thumbImg = document.createElement("img");
                thumbImg.src = `${galleryPath}${image.filename}`;
                thumbImg.draggable = false;
                
                thumb.appendChild(thumbImg);
                thumb.addEventListener("click", () => {
                    currentIndex = index;
                    updateSlideshow();
                });
                thumbsContainer.appendChild(thumb);
            });

            updateSlideshow();
        })
        .catch(() => {
            galleryContainer.innerHTML = `<p style="color: var(--text-color-grayed-out); font-style: italic; text-align: center; padding: 20px;">No images -c-</p>`;
        });
    });
    
}

function packs() {
    let cachedPacks = []

    function renderPacks(filter = "all") {
        const container = document.querySelector(".packs-grid-container");
        if (!container) return;

        const displayPacks = (packsList) => {
            container.innerHTML = "";
            const filtered = filter === "all"
                ? packsList
                : packsList.filter(p => p.category.toLowerCase() === filter.toLowerCase());
            
            filtered.sort((a, b) => {
                const compareCategory = a.category.localeCompare(b.category);
                if (compareCategory !== 0){ 
                    return compareCategory;
                }
                return a.title.localeCompare(b.title);
            });

            if (filtered.length === 0) {
            container.innerHTML = `<p style="color: var(--text-color-grayed-out); font-style: italic; text-align: center; padding: 20px;">No packs found for this category -c-</p>`;
            return;
            }

            filtered.forEach(pack => {
                const packCard = `
                    <div class="pack-card">
                        <img draggable="false" src="/packs/images/${pack.image}" class="pack-cover">
                        <div class="pack-info">
                            <h2>${pack.title}</h2>
                            <p>${pack.description}</p>
                            <a href="${pack.downloadLink}" target="_blank" class="button">${pack.buttonText}</a>
                        </div>
                    </div>
                `;
                container.innerHTML += packCard;
            });
        };

        if (cachedPacks.length > 0) {
            displayPacks(cachedPacks);
        } else {
            fetch('/packs/packs.json')
                .then(response => response.json())
                .then(data => {
                    cachedPacks = data.packs;
                    displayPacks(cachedPacks);
                })
                .catch(error => {
                    console.error("Error loading packs:", error);
                    container.innerHTML = "<p>Couldn't load packs. Try again later -c-</p>";
                });
        }
    }

    window.packsAll = () => renderPacks("all");
    window.packsPresets = () => renderPacks("presets");
    window.packsSamples = () => renderPacks("samples");
    window.packsAssets = () => renderPacks("assets");

    document.addEventListener("DOMContentLoaded", () => {
        if (document.querySelector(".packs-list-container")) {
            renderPacks("all");
        };
    });
}
function projectsPage() {
    function projectsGenerator() {
        const container = document.querySelector(".projects-list-container");
        if (!container) return;

        fetch('/projects/projects.json')
            .then(response => response.json())
            .then(data => {
                container.innerHTML = "";

                data.sort((a, b) => a.name.localeCompare(b.name));
                
                data.forEach(project => {
                    const projectRow = `
                        <div class="project-row">
                            <div class="project-list-cover-box">
                                <img draggable="false" src="/projects/images/${project.cover}" class="project-list-cover">
                            </div>
                            <div class="project-list-info">
                                <h2>${project.name}</h2>
                                <p>${project.description}</p>
                                <a href="${project.link}" target="_blank" class="button">Go</a>
                            </div>
                        </div>
                    `;
                    container.innerHTML += projectRow;
                });
            })
            .catch(error => {
                console.error("Error loading projects:", error);
                container.innerHTML = "<p>Nothing in here. Just only me. Among the nothingness.</p>";
            });
    }

    document.addEventListener("DOMContentLoaded", () => {
        if (document.querySelector(".projects-list-container")) {
            projectsGenerator();
        }
    });
}

function lorePage() {
    const contentContainer = document.getElementById("lore-content");
    const sidebarContainer = document.getElementById("lore-sidebar");
    
    if (!contentContainer || !sidebarContainer) return;

    fetch('/docs/lore.md')
        .then(response => {
            if (!response.ok) throw new Error("Could not find lore.md");
            return response.text();
        })
        .then(markdownText => {
            marked.setOptions({
                gfm: true,
                breaks: true
            });

            contentContainer.innerHTML = marked.parse(markdownText);

            const headings = contentContainer.querySelectorAll("h2, h3");
            
            if (headings.length > 0) {
                let sidebarHTML = `<div class="sidebar-title">Contents:</div><ul>`;
                
                headings.forEach((heading, index) => {
                    if (!heading.id) {
                        heading.id = heading.textContent
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/(^-|-$)/g, "");
                    }

                    if (heading.tagName.toLowerCase() === "h3") {
                        sidebarHTML += `<li><a href="#${heading.id}" class="sidebar-sublink">${heading.textContent}</a></li>`;
                    } else {
                        sidebarHTML += `<li><a href="#${heading.id}">${heading.textContent}</a></li>`;
                    }

                });

                sidebarHTML += `</ul>`;
                sidebarContainer.innerHTML = sidebarHTML;
            }

            if (window.location.hash) {
                const targetId = window.location.hash.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    setTimeout(() => {
                        targetElement.scrollIntoView({ behavior: "smooth", block: "start"});
                    }, 100);
                }
            }
        })
        .catch(error => {
            console.error("Error loading lore:", error);
            contentContainer.innerHTML = "<p>Couldn't load the lore file. Try again later -c-</p>";
        });
}