const Topic = require("../models/topicModel");

exports.createTopic = async (data) => {
  const topic = new Topic(data);
  return await topic.save();
};

exports.getAllTopics = async () => {
  return await Topic.find();
};

exports.getTopicById = async (id) => {
  return await Topic.findById(id);
};

exports.updateTopic = async (id, data) => {
  return await Topic.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteTopic = async (id) => {
  const result = await Topic.findByIdAndDelete(id);
  return result !== null;
};
