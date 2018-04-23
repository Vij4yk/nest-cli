function getQuestions(inputs) {
  const questions = [];
  if (inputs.name === undefined) {
    questions.push({
      type: 'input',
      name: 'name',
      message: 'name :',
      default: 'nestjs-app-name'
    });
  }
  if (inputs.description === undefined) {
    questions.push({
      type: 'input',
      name: 'description',
      message: 'description :',
      default: 'description'
    });
  }
  if (inputs.version === undefined) {
    questions.push({
      type: 'input',
      name: 'version',
      message: 'version :',
      default: '1.0.0'
    });
  }
  if (inputs.author === undefined) {
    questions.push({
      type: 'input',
      name: 'author',
      message: 'author :',
      default: ''
    });
  }
  return questions;
}

module.exports = {
  getQuestions
};
