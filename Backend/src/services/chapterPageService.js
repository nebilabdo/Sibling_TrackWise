const ChapterPage = require("../models/chapterPage");

class ChapterPageService {
  async createPage({ chapter, pageNumber, title, content }) {
    const missingFields = [];
    if (!chapter) missingFields.push("chapter");
    if (!pageNumber) missingFields.push("pageNumber");
    if (!title) missingFields.push("title");
    if (!content) missingFields.push("content");

    if (missingFields.length > 0) {
      throw new Error(`Missing fields: ${missingFields.join(", ")}`);
    }

    const existingPage = await ChapterPage.findOne({ chapter, pageNumber });
    if (existingPage) {
      throw new Error(`Page ${pageNumber} already exists in this chapter`);
    }

    return await ChapterPage.create({ chapter, pageNumber, title, content });
  }

  async getPage(chapterId, pageNumber) {
    const numericPage = Number(pageNumber);
    if (isNaN(numericPage)) {
      throw new Error(`Invalid pageNumber: ${pageNumber}`);
    }

    const page = await ChapterPage.findOne({
      chapter: chapterId,
      pageNumber: numericPage,
    }).populate("chapter", "title");

    if (!page) {
      throw new Error(`Page ${numericPage} not found in chapter ${chapterId}`);
    }
    return page;
  }

  async getPagesByChapter(chapterId) {
    const pages = await ChapterPage.find({ chapter: chapterId })
      .sort("pageNumber")
      .populate("chapter", "title");

    if (pages.length === 0) {
      throw new Error(`No pages found for chapter ${chapterId}`);
    }
    return pages;
  }
}

module.exports = new ChapterPageService();
