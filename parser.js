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
    
    productPrice.price = priceClone.textContent.replace(/[^0-9]/g, '');
    productPrice.oldPrice = priceElement.children[0].textContent.trim().replace(/[^0-9]/g, '');
    productPrice.discount = productPrice.oldPrice - productPrice.price;
    let discountPercent = productPrice.discount / productPrice.oldPrice * 100;
    productPrice.discountPercent = `${discountPercent.toFixed(2)}%`;

    let currencySign = priceElement.children[0].textContent.trim().replace(/[0-9]/g, '');
    switch (currencySign) {
        case '₽':
            productPrice.currency = 'RUB';
            break;
        case '$':
            productPrice.currency = 'USD';
            break;
        case '€':
            productPrice.currency = 'EUR';
            break;
    }

    return productPrice
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
            tags.label.push(tag.textContent.trim())
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

function getImageInfo(image) {
    let info = {};
    
    info.preview = image.src;
    info.full = image.dataset['src'];
    info.alt = image.alt;
    
    return info;
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
    product.currency = priceInfo.currency
    product.tags = getProductTags(productNode);
    product.properties = getProductProperties(productNode);
    product.description = getProductDescription(productNode);
    product.images = getProductImages(productNode);

    return product;
}

function parsePage() {
    return {
        meta: collectPageMeta(),
        product: collectProductInfo(),
        suggested: [],
        reviews: []
    };
}

window.parsePage = parsePage;