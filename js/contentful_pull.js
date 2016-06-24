/*
  Pull down contentful results from epic-contentful element {{result}} and insert into DOM

  Notes
    Partner image links are pulled from the "description" field of that image asset
*/

document.querySelector('epic-contentful').addEventListener('response', function(response) {
    var response = response.detail.value,
        event = response.items[0],
        assets = response.includes.Asset,
        entries = response.includes.Entry,
        assetMap = [],
        entryMap = [];

    // create assetMap so that they are indexable by id
    for (var i = 0; i < assets.length; i += 1) {
        assetMap[assets[i].sys.id] = assets[i].fields;
    }

    // create entryMap so that they are indexable by id
    for (var i = 0; i < entries.length; i += 1) {
        entryMap[entries[i].sys.id] = entries[i].fields;
    }

    // insert hero image
    document.getElementsByClassName('heroTop')[0].style.backgroundImage = 'url(' + assetMap[event.fields.heroImage.sys.id].file.url + ')';

    // insert overlay (title) text
    document.getElementsByClassName('overlay')[0].setAttribute('markdown', event.fields.heroText.replace(/\"/g, "'"));

    // insert intro text
    document.getElementsByClassName('copyText')[0].setAttribute('markdown', event.fields.introText);

    // insert image gallery title
    document.getElementById('imageGalleryTitle').innerText = event.fields.imageGalleryTitle;

    // insert image gallery images
    for (var i = 0; i < event.fields.imageGalleryImages.length; i += 1) {
        var id = event.fields.imageGalleryImages[i].sys.id,
            url = assetMap[id].file.url,
            linkUrl = assetMap[id].description || '#';

        /*
          insert image inside relevant <a> tag
          note the href of the link is pulled from the "description" field of the image asset
        */
        document.getElementsByClassName('partnerDisplay')[0].innerHTML += '<a href="' + linkUrl + '" target="_blank"><img src="' + url + '" /></a>';
    }

    // insert featured video
    document.getElementById('featuredVideo').setAttribute('src', event.fields.videoEmbedUrl);

    // insert featured video title
    document.getElementById('featuredVideoTitle').innerText = event.fields.videoTitle;

    // insert featured video description
    document.getElementById('featuredVideoDescription').setAttribute('markdown', event.fields.videoDescription);

    // insert related video cards
    for (var i = 0; i < event.fields.relatedVideoCards.length; i += 1) {
        var videoEmbedUrl = entryMap[event.fields.relatedVideoCards[i].sys.id].videoEmbedUrl,
            videoTitle = entryMap[event.fields.relatedVideoCards[i].sys.id].videoTitle,
            videoDescription = entryMap[event.fields.relatedVideoCards[i].sys.id].videoDescription,
            slug = entryMap[event.fields.relatedVideoCards[i].sys.id].slug.replace(/(events)/, '');

        document.getElementsByClassName('contentCardGallery')[0].innerHTML += '<div class="card">' +
            '<div class="topHalf">' +
            '<div class="embed-container">' +
            '<iframe src="' + videoEmbedUrl + '" frameborder="0" allowfullscreen></iframe>' +
            '</div>' +
            '</div>' +
            '<div class="bottomHalf">' +
            '<div class="details">' +
            '<h3>' + videoTitle + '</h3>' +
            '<marked-element markdown="' + videoDescription + '"></marked-element>' +
            '<a href="' + slug + '" class="button">Read More</a>' +
            '</div>' +
            '</div>' +
            '</div>';
    }

    // console.log(response.items[0].fields);
    // console.log(response);
});
