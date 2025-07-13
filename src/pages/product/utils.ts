/** @format */

const getAllProductBannerImages = (pageTitle?: string) => {
    let bannerImage = "https://bizweb.dktcdn.net/100/490/431/files/phu-kien-the-thao.jpg?v=1696171623137";
    switch (pageTitle) {
        case "Môn thể thao":
            bannerImage = "https://bizweb.dktcdn.net/100/490/431/files/cac-mon-the-thao.jpg";
            break;
        case "Nam":
            bannerImage = "https://bizweb.dktcdn.net/100/490/431/files/danh-cho-nam.jpg?v=1696171539863";
            break;
        case "Nữ":
            bannerImage = "https://bizweb.dktcdn.net/100/490/431/files/danh-cho-nu.jpg?v=1696171384097";
            break;
        case "Trẻ em":
            bannerImage = "https://bizweb.dktcdn.net/100/490/431/files/danh-cho-tre-em.jpg?v=1696171726563";
            break;
        case "Phụ kiện":
        default:
            break;
    }
    return bannerImage;
};

export {
    getAllProductBannerImages
}
