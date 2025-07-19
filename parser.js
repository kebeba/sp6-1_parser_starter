function getPriceValue(text) {
    return text.replace(/[^0-9]/g, '');
}

function getPriceCurrency(text) {
    let currencySign = text.replace(/[0-9]/g, '');
    switch (currencySign) {
        case '₽':
            return 'RUB';
        case '$':
            return 'USD';
        case '€':
            return 'EUR';
    }
}

function getImageInfo(image) {
    let info = {};
    
    info.preview = image.src;
    info.full = image.dataset['src'];
    info.alt = image.alt;
    
    return info;
}

function getSuggestedItemInfo(itemNode) {
    let item = {};
    const itemPrice = itemNode.querySelector('b').textContent.trim();
    
    item.image = itemNode.querySelector('img').src;
    item.name = itemNode.querySelector('h3').textContent.trim();
    item.description = itemNode.querySelector('p').textContent.trim();
    item.currency = getPriceCurrency(itemPrice);
    item.price = getPriceValue(itemPrice);
    
    return item;
}

function getReviewContent(reviewNode) {
    let review = {};

    review.rating = 0;
    Array.from(reviewNode.querySelector('.rating').children).forEach(child => {
        if (child.classList.contains('filled')) {
            review.rating += 1;
        }
    });

    review.title = reviewNode.querySelector('.title').textContent.trim();
    review.description = reviewNode.querySelector('p').textContent.trim();

    let author = {}
    const authorNode = reviewNode.querySelector('.author');
    author.avatar = authorNode.querySelector('img').src;
    author.name = authorNode.querySelector('span').textContent.trim();
    review.author = author;
    review.date = authorNode.querySelector('i').textContent.trim().split('/').join('.');

    return review;
}

function getPageOpengraph() {
    let ogs = {};
    ogTags = document.head.querySelectorAll('meta[property^="og"]');
    ogTags.forEach(tag => {
        ogs[tag.getAttribute('property').split(':').at(-1).trim()] = tag.getAttribute('content').trim();
    });
    return ogs;
}

function getProductPrice(product) {
    let productPrice = {}
    let priceElement = product.querySelector('.price');
    let priceClone = priceElement.cloneNode(true);
    
    priceClone.removeChild(priceClone.children[0]);
    
    productPrice.price = getPriceValue(priceClone.textContent);
    productPrice.oldPrice = getPriceValue(priceElement.children[0].textContent.trim());
    productPrice.discount = productPrice.oldPrice - productPrice.price;
    productPrice.currency = getPriceCurrency(priceElement.children[0].textContent.trim());

    let discountPercent = productPrice.discount / productPrice.oldPrice * 100;
    productPrice.discountPercent = `${discountPercent.toFixed(2)}%`;

    return productPrice;
}

function getProductTags(product) {
    let tags = {
        category: [],
        discount: [],
        label: [],
    }
    Array.from(product.querySelector('.tags').children).forEach(tag => {
        if (tag.classList.contains('green')) {
            tags.category.push(tag.textContent.trim());
        } else if (tag.classList.contains('red')) {
            tags.discount.push(tag.textContent.trim());
        } else if (tag.classList.contains('blue')) {
            tags.label.push(tag.textContent.trim());
        }
    });

    return tags;
}

function getProductProperties(product) {
    let props = {}
    Array.from(product.querySelector('.properties').children).forEach(prop => {
        props[prop.children[0].textContent.trim()] = prop.children[1].textContent.trim();
    })
    return props;
}

function getProductDescription(product) {
    let productDescription = product.querySelector('.description')
    let descClone = productDescription.cloneNode(true);
    Array.from(descClone.children).forEach(child => {
        child.removeAttribute('class');
    });
    return descClone.innerHTML.trim();
}

function getProductImages(product) {
    let productImages = [];
    
    images = product.querySelectorAll('img');
    previewSrc = product.querySelector('img[alt="preview"]').src;
    
    images.forEach(image => {
        imageSrc = image.dataset['src'];
        if (imageSrc != previewSrc && imageSrc != undefined) {
            productImages.push(getImageInfo(image));
        } else if (imageSrc == previewSrc) {
            productImages.unshift(getImageInfo(image));
        }
    })

    return productImages;
}

function collectPageMeta () {
    let pageMeta = {};
    
    pageMeta.language = document.documentElement.lang.trim();
    // pageMeta.charset = document.head.querySelector('meta[charset]').getAttribute('charset').trim();
    pageMeta.title = document.head.querySelector('title').textContent.split('—')[0].trim();
    pageMeta.keywords = document.head.querySelector('meta[name="keywords"]').content.split(', ');
    pageMeta.opengraph = getPageOpengraph();
    pageMeta.description = document.head.querySelector('meta[name="description"]').content.trim();
    pageMeta.opengraph.title = pageMeta.title;

    return pageMeta;
}

function collectProductInfo() {
    let product = {};
    let productNode = document.body.querySelector('.product');
    let priceInfo = getProductPrice(productNode);

    product.id = productNode.dataset['id'];
    product.name = document.querySelector('h1').textContent.trim();
    product.isLiked = productNode.querySelector('.like').classList.contains('active');
    product.price = +priceInfo.price;
    product.oldPrice = +priceInfo.oldPrice;
    product.discount = priceInfo.discount;
    product.discountPercent = priceInfo.discountPercent;
    product.currency = priceInfo.currency;
    product.tags = getProductTags(productNode);
    product.properties = getProductProperties(productNode);
    product.description = getProductDescription(productNode);
    product.images = getProductImages(productNode);

    return product;
}

function collectSuggestedItems() {
    let suggested = []
    
    let suggestedItemsNode = document.querySelector('.suggested');
    let itemNodes = suggestedItemsNode.querySelector('.items').children;
    
    Array.from(itemNodes).forEach(item => {
        suggested.push(getSuggestedItemInfo(item));

    });
    
    return suggested;
}

function collectReviews() {
    let reviews = [];
    
    const reviewsSection = document.querySelector('.reviews');
    const reviewsNodes = reviewsSection.querySelector('.items').children;
    Array.from(reviewsNodes).forEach(review => {
        reviews.push(getReviewContent(review));
    });

    return reviews;
}

function parsePage() {
    return {
        meta: collectPageMeta(),
        product: collectProductInfo(),
        suggested: collectSuggestedItems(),
        reviews: collectReviews()
    };
}

window.parsePage = parsePage;