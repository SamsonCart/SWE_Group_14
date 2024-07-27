// export { request } from './request';

function appendFormData(data, parentKey = '') {
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const value = data[key];
      const formKey = parentKey ? `${parentKey}[${key}]` : key;

      if (value instanceof FileList) {
        for (let i = 0; i < value.length; i++) {
          formData.append(`${formKey}[]`, value[i]);
        }
      } else if (typeof value === 'object' && !(value instanceof File)) {
        appendFormData(value, formKey);
      } else {
        formData.append(formKey, value);
      }
    }
  }
}

module.exports = { appendFormData };
