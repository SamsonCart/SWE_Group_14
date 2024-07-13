const { response } = require('../../classes');
const Role = require('../../models/role');
const PostCategory = require('../../models/postCategory');
const Post = require('../../models/post');
const slug = require('slug');
const { TicketStatus, TicketPriority } = require('../../models/ticket');
const { TodoStatus, TodoPriority } = require('../../models/todo');

async function init(req, res, next) {
  try {
    // Create user roles
    const newRoles = [];
    const roleCount = await Role.estimatedDocumentCount();
    if (roleCount === 0) {
      const roles = ['user', 'moderator', 'admin'];
      for (const name of roles) {
        await new Role({ name }).save();
        newRoles.push(`added '${name}' to roles collection`);
      }
    }

    // Create post categories and posts
    const newCategories = [];
    const newPosts = [];
    const postCategoryCount = await PostCategory.estimatedDocumentCount();
    if (postCategoryCount === 0) {
      const categories = ['Test Category', 'General', 'Technology'];
      const posts = [
        { title: 'Post 1', description: 'Description 1' },
        { title: 'Post 2', description: 'Description 2' },
        { title: 'Post 3', description: 'Description 3' },
      ];

      for (const [index, name] of categories.entries()) {
        const url = slug(name);
        const category = await PostCategory.create({ name, url });

        const post = posts[index];
        post.postCategories = category._id;
        post.url = slug(post.title);

        await Post.create({ ...post });

        newCategories.push(`added '${name}' to post categories collection`);
        newPosts.push(`added '${post.title}' to posts collection`);
      }
    }

    // Create ticket priorities
    const newTicketPriorities = [];
    const ticketPriorityCount = await TicketPriority.estimatedDocumentCount();
    if (ticketPriorityCount === 0) {
      const priorities = ['Lowest', 'Lower', 'Medium', 'Higher', 'Highest'];
      for (const [order, name] of priorities.entries()) {
        await new TicketPriority({ name, order }).save();
        newTicketPriorities.push(`added '${name}' to ticket priorities collection`);
      }
    }

    // Create ticket statuses
    const newTicketStatuses = [];
    const ticketStatusCount = await TicketStatus.estimatedDocumentCount();
    if (ticketStatusCount === 0) {
      const statuses = ['Open', 'In Progress', 'On Hold', 'Closed', 'Resolved'];
      for (const [order, name] of statuses.entries()) {
        await new TicketStatus({ name, order }).save();
        newTicketStatuses.push(`added '${name}' to ticket statuses collection`);
      }
    }

    // Create todo priorities
    const newTodoPriorities = [];
    const todoPriorityCount = await TodoPriority.estimatedDocumentCount();
    if (todoPriorityCount === 0) {
      const priorities = ['Lowest', 'Lower', 'Medium', 'Higher', 'Highest'];
      for (const [order, name] of priorities.entries()) {
        await new TodoPriority({ name, order }).save();
        newTodoPriorities.push(`added '${name}' to todo priorities collection`);
      }
    }

    // Create todo statuses
    const newTodoStatuses = [];
    const todoStatusCount = await TodoStatus.estimatedDocumentCount();
    if (todoStatusCount === 0) {
      const statuses = ['Open', 'In Progress', 'On Hold', 'Closed', 'Resolved'];
      for (const [order, name] of statuses.entries()) {
        await new TodoStatus({ name, order }).save();
        newTodoStatuses.push(`added '${name}' to todo statuses collection`);
      }
    }

    response.successed(res, {
      newRoles,
      newCategories,
      newPosts,
      newTicketPriorities,
      newTicketStatuses,
      newTodoPriorities,
      newTodoStatuses,
    });
  } catch (err) {
    console.error('Error initializing data:', err);
    response.failed(res, 'Initialization failed.');
  }
}

module.exports = init;
