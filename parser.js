function getPageLanguage() {
    return document.documentElement.lang.trim();
}

function getPageCharset() {
    return document.head.querySelector('meta[charset]').getAttribute('charset').trim();
}

function getPageTitle() {
    return document.head.querySelector('title').textContent.split('—')[0].trim();
}

function getPageKeywords() {
    return document.head.querySelector('meta[name="keywords"]').content.split(', ');
}

function getPageDescription() {
    return document.head.querySelector('meta[name="description"]').content.trim();
}

function getPageOpengraph() {
    let ogs = {};
    ogTags = document.head.querySelectorAll('meta[property^="og"]');
    ogTags.forEach(tag => {
        ogs[tag.getAttribute('property').split(':').at(-1).trim()] = tag.getAttribute('content').trim();
    });
    return ogs;
}

function getProduct() {
    return document.body.querySelector('.product');
}

function getProductID() {
    return getProduct().dataset['id'];
}

function getImageInfo(image) {
    let info = {};
    
    info.preview = image.src;
    info.full = image.dataset['src'];
    info.alt = image.alt;
    
    return info;
}

function getProductImages() {
    let productImages = [];
    
    product = getProduct();
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

function getProductLike() {
    return getProduct().querySelector('.like').classList.contains('active');
}

function getProductName() {
    return document.querySelector('h1').textContent.trim();
}

function getProductTags() {
    let tags = {
        category: [],
        discount: [],
        label: [],
    }
    Array.from(getProduct().querySelector('.tags').children).forEach(tag => {
        if (tag.classList.contains('green')) {
            tags.category.push(tag.textContent.trim());
        } else if (tag.classList.contains('red')) {
            tags.discount.push(tag.textContent.trim());
        } else if (tag.classList.contains('blue')) {
            tags.label.push(tag.textContent.trim())
        }
    });

    return tags;
}

function getProductFullPrice() {
    return document.querySelector('.price').children[0].textContent.trim().replace(/[^0-9]/g, '');
}

function getProductDiscountPrice() {
    let priceElement = document.querySelector('.price');
    let priceClone = priceElement.cloneNode(true);
    priceClone.removeChild(priceClone.children[0]);
    return priceClone.textContent.replace(/[^0-9]/g, '');
}

function getProductDiscountSize() {
    return getProductFullPrice() - getProductDiscountPrice();
}

function getProductDiscountPercentage() {
    return getProductDiscountSize() / getProductFullPrice() * 100;
}

function getProductCurrency() {
    let currencySign = document.querySelector('.price').children[0].textContent.trim().replace(/[0-9]/g, '');
    switch (currencySign) {
        case '₽':
            return 'RUB';
        case '$':
            return 'USD';
        case '€':
            return 'EUR';
    }
}

function getProductProperties() {
    let props = {}
    Array.from(document.querySelector('.properties').children).forEach(prop => {
        props[prop.children[0].textContent.trim()] = prop.children[1].textContent.trim();
    })
    return props;
}

function getProductDescription() {
    return document.querySelector('.description').innerHTML.trim();
}

function collectPageMeta() {
    let pageMeta = {}
    
    pageMeta.title = getPageTitle();
    pageMeta.description = getPageDescription();
    pageMeta.keywords = getPageKeywords();
    pageMeta.language = getPageLanguage();
    pageMeta.charset = getPageCharset();
    pageMeta.opengraph = getPageOpengraph();
    
    return pageMeta;
}

function parsePage() {
    console.log(getProductDescription());
    return {
        meta: {},
        product: {},
        suggested: [],
        reviews: []
    };
}

window.parsePage = parsePage;