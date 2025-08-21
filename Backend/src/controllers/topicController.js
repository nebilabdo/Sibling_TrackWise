const TopicService = require("../services/topicService");

exports.createTopic = async (req, res) => {
  try {
    const topic = await TopicService.createTopic(req.body);
    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllTopics = async (req, res) => {
  try {
    const topics = await TopicService.getAllTopics();
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTopicById = async (req, res) => {
  try {
    const topic = await TopicService.getTopicById(req.params.id);
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    res.json(topic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTopic = async (req, res) => {
  try {
    const updatedTopic = await TopicService.updateTopic(
      req.params.id,
      req.body
    );
    if (!updatedTopic)
      return res.status(404).json({ message: "Topic not found" });
    res.json(updatedTopic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTopic = async (req, res) => {
  try {
    const deleted = await TopicService.deleteTopic(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Topic not found" });
    res.json({ message: "Topic deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
