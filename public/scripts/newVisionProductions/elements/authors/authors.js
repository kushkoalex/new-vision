NV.authors = function ($parent) {
    var nv = this,
        global = nv.global,
        a9 = global.A9,
        tp = global.cnCt.tp,
        settings = nv.settings,
        controlsDescriptors = settings.controlsDescriptors,
        authorsData = settings.dataModels.authors,
        $fragment,
        $fragmentTag,
        $fragmentImage,
        build,
        buildTag,
        $authorProducts = [],
        $authorImagesSet = [],
        timeout_id,
        i,
        j,
        u,
        currentAuthorIndex,
        currentAuthorProductImageIndex = [],
    //$authorsSet=[],
        $authorProductsImages = [],

        itemsInRow = settings.controlsDescriptors.site.authorProductItemsInRowCount,
        itemsCount = 0,
        authorItemsCount = 0;

    function buildMediaForm(authorsData) {
        $fragment = global.document.createDocumentFragment();
        $fragmentTag = global.document.createDocumentFragment();
        $fragmentImage = global.document.createDocumentFragment();
        //console.log(authorsData);

        a9.each(authorsData, function (authorsDataItem) {

            //console.log(authorsDataItem);

            if (itemsCount !== 0 && itemsCount % itemsInRow == 0) {
                tp('clear', $fragment)
            }

            authorsDataItem.index = authorItemsCount;
            authorItemsCount++;
            build = tp('author', authorsDataItem, $fragment);

            currentAuthorProductImageIndex.push(0);


            a9.addEvent(build.r, 'mouseover', function (e) {
                currentAuthorIndex = e.target.parentElement.parentElement.parentElement.getAttribute('index');
                timeout_id = setTimeout(slideAuthorImage, 10);
            });

            a9.addEvent(build.r, 'mouseout', function (e) {
                var index = e.target.parentElement.parentElement.parentElement.getAttribute('index');
                clearTimeout(timeout_id);
                setTimeout(setFirstImageActive, 10);
            });


            function hideInactiveImages() {
                for (j = 0; j < $authorImagesSet.length; j++) {
                    for (i = 0; i < $authorImagesSet[j].length; i++) {
                        a9.removeClass($authorImagesSet[j][i], "active");
                    }
                }
            }

            function updateActiveIndex(index) {
                if (index !== u) {
                    currentAuthorProductImageIndex[currentAuthorIndex] = 0;
                }
                else {
                    for (i = 0; i < $authorImagesSet.length; i++) {
                        if (i == currentAuthorIndex) {
                            currentAuthorProductImageIndex[currentAuthorIndex]++;
                            if (currentAuthorProductImageIndex[currentAuthorIndex] >= $authorImagesSet[currentAuthorIndex].length) {
                                currentAuthorProductImageIndex[currentAuthorIndex] = 1;
                            }
                        }
                        else {
                            currentAuthorProductImageIndex[i] = 0;
                        }
                    }
                }
            }

            function showActiveImage() {
                for (j = 0; j < $authorImagesSet.length; j++) {
                    for (i = 0; i < $authorImagesSet[j].length; i++) {
                        if (currentAuthorProductImageIndex[j] == i) {
                            a9.addClass($authorImagesSet[j][i], "active");
                        }
                    }
                }
            }


            function setFirstImageActive() {
                hideInactiveImages();
                updateActiveIndex(0);
                showActiveImage();
            }


            function slideAuthorImage() {
                hideInactiveImages();
                updateActiveIndex();
                showActiveImage();
                timeout_id = setTimeout(slideAuthorImage, controlsDescriptors.site.authorSlideTimeout);
            }

            $authorProducts.push(build.r);


            itemsCount++;

            var $images = build.images,
                $authorImages = [],
                imageIndex = 0,
                contentImagePath = nv.settings.controlsDescriptors.site.contentImagesPathAuthorsThumb,
                productsThumbPath = nv.settings.controlsDescriptors.site.contentImagesPathProductsThumb,
                photoPath = contentImagePath + authorsDataItem.photo;

            var $authorImagePreview = tp('authorImagePreview', {
                imgSrc: photoPath,
                index: imageIndex,
                isActive: true
            }, $fragmentImage);

            $authorImages.push($authorImagePreview.r);
            imageIndex++;

            a9.each(authorsDataItem.productImagePreviews, function (image) {

                var $imgPreview = tp('authorImagePreview', {
                    imgSrc: productsThumbPath + image,
                    index: imageIndex
                }, $fragmentImage);

                $authorImages.push($imgPreview.r);
                $images.appendChild($fragmentImage);
                imageIndex++;
            });

            $authorImagesSet.push($authorImages);

            //console.log($authorImagesSet);


            var $tags = build.tags;

            a9.each(authorsDataItem.tags, function (tag) {
                //console.log(tag);

                tag.pageUrl = nv.settings.controlsDescriptors.site.searchFilterUrlArtists;
                buildTag = tp('tag', tag, $fragmentTag);

                $tags.appendChild($fragmentTag);
            });

        });

        tp('clear', $fragment);

        $authors.appendChild($fragment);
    }

    var $authors = tp('authors', $parent).authorsBlocks;

    nv.searchForm($parent, settings.controlsDescriptors.site.searchFilterUrlArtists);

    buildMediaForm(authorsData);
};