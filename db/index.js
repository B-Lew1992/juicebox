const { Client } = require('pg') // imports the pg module
const client = new Client('postgres://localhost:5432/juicebox-dev');

async function createUser({ 
  username, 
  password,
  name,
  location 
}) {
  try {
    const { rows: [ user ]  } = await client.query(`
      INSERT INTO users(username, password, name, location) 
      VALUES($1, $2, $3, $4) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
    `, [username, password, name, location]);

    return user;
  } catch (error) {
    throw error;
  }
}

async function createPost({
  authorId,
  title,
  content
}) {
  try {
    const { rows: [ posts ] } = await client.query(`
      INSERT INTO posts("authorId", title, content)
      VALUES($1, $2, $3) 
      RETURNING *;
    `, [authorId, title, content]);
    return posts;
  } catch (error) {
    throw error;
  }
}

async function getAllUsers() {
  const { rows } = await client.query(`SELECT id, username, name, location, active FROM users;`);

  return rows;
}

async function updateUser(id, fields = {}) {

  const { rows: [ user ] } = await client.query(`

`, []);
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  
  if (setString.length === 0) {
    return user;
  }

  try {
    const result = await client.query(`
      UPDATE users
      SET ${ setString }
      WHERE id=${ id }
      RETURNING *;
    `, Object.values(fields));

    return result;
  } catch (error) {
    throw error;
  }
}

async function updatePost(id, fields = {}) {
  const { rows: [ posts ] } = await client.query(`

`, []);
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  
  if (setString.length === 0) {
    return posts;
  }

  try {
    const result = await client.query(`
      UPDATE posts 
      SET ${ setString }
      WHERE id=${ id }
      RETURNING *;
    `, Object.values(fields));

    return result;
  } catch(error) {
    throw error;
  }
}

async function getAllPosts() {
  const { rows } = await client.query(`SELECT id, "authorId", title, content, active FROM posts;`);

  return rows;
}


async function getPostsByUser(userId) {
  try {
    const { rows } = await client.query(`
      SELECT * FROM posts
      WHERE "authorId"=${ userId };
    `);

    return rows;
  } catch (error) {
    throw error;
  }
}


async function getUserById(userId) {
  try { 
    console.log("can you see me");
    const { rows:[ user ] } = await client.query(`
      SELECT * FROM users
      WHERE "id"=${ userId }
    `) 
    if (!user) {
      return null
    }
    delete user.password
    user.posts = await getPostsByUser(userId)
    console.log(user)
    return user
  } catch (error) {
    throw error;
  }
}



module.exports = {  
  client,
  createUser,
  getAllUsers,
  updateUser,
  createPost,
  getAllPosts,
  updatePost,
  getPostsByUser,
  getUserById
};