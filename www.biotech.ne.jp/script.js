const URL_CFRONT = "https://d2jtrui7bbhww8.cloudfront.net";
const URL_CFRONT_VIDEO = "https://d2jtrui7bbhww8.cloudfront.net/upload-video";
const URL_GENERATOR_TOKEN =
  "https://d2jtrui7bbhww8.cloudfront.net/generate-token/test";
var token = "";

function fetchToken() {
  return new Promise((resolve, reject) => {
    fetch(URL_GENERATOR_TOKEN)
      .then((response) => response.json())
      .then((data) => {
        token = data.data;
        resolve(token);
      })
      .catch((error) => {
        console.error("Error fetching token:", error);
        reject(error);
      });
  });
}

function removeProtocol(url) {
  return url.replace(/^https?:\/\//, "");
}

function getNewUrlReplace(originalUrl) {
  const currentDomain = removeProtocol(window.location.origin);
  const fullUrl = new URL(originalUrl, window.location.href).href;
  let domainImgUrlEncode = window.btoa(fullUrl);
  return `${URL_CFRONT}/${currentDomain}/${domainImgUrlEncode}?token=${token}`;
}

async function getNewUrlReplaceVideo(originalUrl) {
  const currentDomain = removeProtocol(window.location.origin);
  const fullUrl = new URL(originalUrl, window.location.href).href;
  console.log(fullUrl)
  const domainVideoUrl = window.btoa(fullUrl);

  try {
    const url = `${URL_CFRONT_VIDEO}/${currentDomain}/${domainVideoUrl}?token=${token}`;
    console.log("url_send", url)

    const response = await fetch(url);
    console.log("respone", response)
    const data = await response.json();

    const urlValue = Object.values(data.data)[0] || null;
    return urlValue ? urlValue + `?token=${token}` : null;
  } catch (error) {
    console.error("Error fetching token:", error);
    throw error; // Re-throw the error after logging it
  }
}

function shouldSkipUrl(url) {
  return /\.(svg|avif|webp)$/.test(url);
}

function isDataBase64(url) {
  return url.startsWith("data:");
}

function replaceImageSrc(image) {
  return new Promise((resolve) => {
    if (image.src && !shouldSkipUrl(image.src)) {
      image.setAttribute("loading", "lazy");
      image.setAttribute("decoding", "async");
      image.src = getNewUrlReplace(image.src);
    }
    resolve(`Processed image src: ${image.src}`);
  });
}

function replaceImageSrcset(element) {
  return new Promise((resolve) => {
    if (element.srcset && !shouldSkipUrl(element.srcset)) {
      //process if srcset have style width, height
      const srcsetParts = element.srcset.split(",").map((part) => part.trim());
      const newSrcset = srcsetParts
        .map((part) => {
          const [url, descriptor] = part.split(" ");
          const newUrl = getNewUrlReplace(url);
          return `${newUrl} ${descriptor}`;
        })
        .join(", ");
        
      element.setAttribute("loading", "lazy");
      element.setAttribute("decoding", "async");
      element.srcset = newSrcset;
    }
    resolve(`Processed image srcset for: ${element.srcset || "No srcset"}`);
  });
}

function isAbsoluteUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

function getOrigin(url, baseSheetUrl) {
  const baseUrl = new URL(baseSheetUrl);
  const urlPath = new URL(url, baseUrl).pathname;
  const origin = baseUrl.origin;
  return `${origin}${urlPath}`;
}

function processCssRule(rule, baseSheetUrl) {
  if (rule.style) {
    ["backgroundImage", "background"].forEach((prop) => {
      const urlValue = rule.style[prop];
      if (urlValue && urlValue.includes("url(")) {
        const urlRegex = /url\(["']?(.*?)["']?\)/g;
        const updatedCssString = urlValue.replace(urlRegex, (match, url) => {
          if (
            shouldSkipUrl(url) ||
            isDataBase64(url) ||
            url.includes(URL_CFRONT)
          ) {
            return match;
          }
          const urlOrigin = getOrigin(url, baseSheetUrl);
          const newUrl = getNewUrlReplace(urlOrigin);
          return `url("${newUrl}")`;
        });
        rule.style[prop] = updatedCssString;
      }
    });
  }
}

function processCssRules(rules, baseSheetUrl) {
  const promises = Array.from(rules).map((rule) => {
    if (rule instanceof CSSMediaRule) {
      return processCssRules(rule.cssRules, baseSheetUrl);
    } else {
      processCssRule(rule, baseSheetUrl);
      return Promise.resolve();
    }
  });
  return Promise.all(promises);
}

function processWriteFileCss() {
  return new Promise((resolve, reject) => {
    try {
      const styleSheets = Array.from(document.styleSheets).map((sheet) => {
        if (!sheet.href) return Promise.resolve(); // Ignore inline stylesheets since they don't have URLs
        const baseSheetUrl = new URL(sheet.href);
        return processCssRules(sheet.cssRules || sheet.rules, baseSheetUrl);
      });
      Promise.all(styleSheets).then(resolve).catch(reject);
    } catch (error) {
      console.error("General error in processWriteFileCss:", error);
      reject(error);
    }
  });
}

function cleanPath(path) {
  return path.replace(/^(?:\.\.\/|\.\/)+/, "");
}

function processInlineStyle() {
  return new Promise((resolve, reject) => {
    try {
      const elements = document.querySelectorAll('[style*="background"]');

      elements.forEach((element) => {
        let style = element.getAttribute("style");

        const updatedStyle = style.replace(
          /background(-image)?: url\(["']?(.*?)["']?\)(.*?);/g,
          (match, p1, url, p3) => {
            if (shouldSkipUrl(url)) return match;
            const urlPath = isAbsoluteUrl(cleanPath(url))
              ? cleanPath(url)
              : `${window.location.origin}/${cleanPath(url)}`;
            const urlEncode = getNewUrlReplace(urlPath);
            return `background${p1 || ""}: url('${urlEncode}')${p3};`;
          }
        );

        element.setAttribute("style", updatedStyle);
      });

      resolve("Updated all inline background images successfully.");
    } catch (error) {
      reject(error);
    }
  });
}

function processAllImages() {
  return new Promise((resolve, reject) => {
    const images = document.querySelectorAll(
      "img[src], picture source[src], img[srcset], picture source[srcset]"
    );
    const processImages = Array.from(images).map((element) => {
      if (element.srcset) {
        replaceImageSrcset(element);
      }

      if (element.src) {
        replaceImageSrc(element);
      }
    });

    Promise.all([...processImages, processWriteFileCss(), processInlineStyle()])
      .then(resolve)
      .catch(reject);
  });
}

function processAllVideos() {
  return new Promise((resolve) => {
    const videoElements = document.querySelectorAll("video");

    videoElements.forEach(async (video) => {
      const urlVideo = video.getAttribute("src");

      if (urlVideo) {
        const urlReplace = await getNewUrlReplaceVideo(urlVideo);
        urlReplace
          ? replaceVideoSrcSource(video, urlReplace)
          : replaceVideoSrcSource(video, urlVideo, "rocket-page");
      }
      const sources = video.querySelectorAll("source");

      if (sources) {
        sources.forEach(async (source) => {
          const urlSource = source.getAttribute("src");
          if (urlSource) {
            console.log("urlSource", urlSource);

            const urlReplace = await getNewUrlReplaceVideo(urlSource);
            console.log("urlReplace", urlReplace);

            urlReplace
              ? replaceVideoSrcSource(source, urlReplace)
              : replaceVideoSrcSource(
                  source,
                  urlSource,
                  "rocket-page-video-detected"
                );
          }
        });
      }
    });

    resolve("replace video path");
  });
}

const replaceVideoSrcSource = (source, videoReplace, attr = "") => {
  if (!videoReplace) return;

  const updateSource = () => {
    source.setAttribute("src", videoReplace);
    if (attr) source.setAttribute("rocket-page", attr);
  };

  switch (source.tagName) {
    case "VIDEO":
      updateSource();
      break;
    case "SOURCE":
      updateSource();
      source.parentNode.load();
      break;
    case "IFRAME":
    case "EMBED":
      updateSource();
      source.setAttribute("loading", "lazy");
      break;
    default:
      break;
  }
};
fetchToken()
  .then((fetchedToken) => {
    if (!fetchedToken) {
      console.log("Token is not available, processing will not run.");
      return;
    }
    return Promise.all([processAllImages(), processAllVideos()]);
  })
  .then(([imageResults, videoPaths]) => {
    if (imageResults) {
      console.log("All images and sources have been processed successfully.");
    }
    if (videoPaths) {
      console.log("Video paths processed:", videoPaths);
    }
  })
  .catch((error) => {
    console.error("An error occurred:", error);
  });
