function getCards () {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.status === 200) {

            const res = JSON.parse(this.responseText);

            let response = '';
            console.log("[Script] discography.js/getcards - load...");
            console.log("[Script] discography.js/getcards - lenght: " + res.discography.length);
            for (let i=0; i <= res.discography.length-1; i++) {
                
                let cover_img = getCoverImg(res, i);
                let title = getTitle(res, i);
                let author = getAuthor(res, i)
                let streaming = getStreaming(res, i);
                let youtube = getYoutube(res, i);

                if (streaming != null || youtube != null) {
                    response += `<div class="card">`
                } else {
                    response += `<div class="card ytranslate">`
                }   
                if (cover_img == null) {
                    response += `<img src="images/discography/blankart.jpg" draggable=false alt="blankart.jpg" style="width:100%">`
                } else {
                    response += `<img src="images/discography/${cover_img}" draggable=false alt="${cover_img}" style="width:100%">`
                }
                    if (streaming != null || youtube != null) {
                        response += `<div class="links-container">`
                    } else {
                        response += `<br>`
                        
                    }
                        if(streaming != null) {
                            response += `<span class="streaming"><a href="${streaming}" target="_blank"><i class="fa-solid fa-music" style="color: #ffffff;"></i></a></a></span>`
                        }
                        if(youtube != null) {
                            response += `<span class="youtube"><a href="${youtube}" target="_blank"><i class="fa-brands fa-youtube" style="color: #ffffff;"></i></a></a></span>`
                        }
                    if (streaming != null || youtube != null) {
                        response += `</div>`
                    }
                    response += `<div class="container"> 
                        <span class="title">${title}</span>
                        <br>
                        <span class="author">By ${author}</span>`
                        
                        response += `
                        </div>
                    </div>
                </div>`
            }
            document.querySelector('.cards-content').innerHTML = response;
        } 
    }
    xhr.open('GET', '../json/discography.json', true);
    xhr.send();
}
function getCoverImg(res, id) {
    console.log("[Script] discography.js/getCoverImg - image: " + res.discography[id].image);
    return res.discography[id].image;
}
function getTitle(res, id) {
    console.log("[Script] discography.js/getTitle - title: " + res.discography[id].title);
    return res.discography[id].title;
}
function getAuthor(res, id) {
    console.log("[Script] discography.js/getAuthor - author: " + res.discography[id].author);
    return res.discography[id].author;
}
function getStreaming(res, id) {
    console.log("[Script] discography.js/getStreaming - streaming: " + res.discography[id].streaming);
    return res.discography[id].streaming;
}
function getYoutube(res, id) {
    console.log("[Script] discography.js/getYoutube - youtube: " + res.discography[id].youtube);
    return res.discography[id].youtube;
}