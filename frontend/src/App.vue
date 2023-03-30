<template>
  <div id="app" class="container">
    <br>
    <b-nav>
      <b-nav-item @click="article = null">Все статьи</b-nav-item>
      <b-nav-item @click="getNewArticle">Добавить статью</b-nav-item>
    </b-nav>
    <hr>
    <h3 v-if="articles.length>0">Все статьи</h3>
    <b-table striped hover :items="articles" @row-clicked="articleClick"></b-table>
    
    <div v-if="article && !editMode">
      <h3>{{ article.name }}</h3>
      <p v-html="article.content" />
      <b-button variant="success" @click="editMode = true" >Изменить</b-button>
    </div>

    <b-form @submit.prevent="postArticle" v-if="article && editMode">
      <h3 v-if="article.id > 0">Изменение статьи</h3>
      <h3 v-else>Добавление статьи</h3>
      <b-form-group
        id="input-group-1"
        label="Название:"
        label-for="name"
        description="Введите название статьи"
      >
        <b-form-input
          id="name"
          v-model="article.name"
          type="text"
          placeholder="Введите название статьи"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-2"
        label="Содержание:"
        label-for="content"
        description="Введите содержание статьи"
      >
        <b-form-textarea
          id="content"
          v-model="article.content"
          placeholder="Введите содержание статьи"
          rows="3"
          max-rows="6"
        ></b-form-textarea>
      </b-form-group>
      <b-button type="submit" variant="primary">Сохранить</b-button>
      <b-button variant="danger" v-if="article.id > 0" @click="delArticle" style="margin-left: 6px;">Удалить</b-button>
    </b-form>
    
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      editMode: false, 
      articles: [],
      article: null
    }
  },
  methods: {
    getArticles() {
      this.axios.get("api/articles").then((response) => {
          this.articles = response.data
      })
    },
    articleClick(article) {
      this.article = article
      this.editMode = false
    },
    postArticle() {
      if(this.article.id > 0)
        this.axios.post("api/article", this.article).then(() => {
            this.editMode = false
        }) 
      else 
        this.axios.put("api/articles", this.article).then((response) => {
              this.editMode = false
              this.article.id = response.data.insertId
              this.articles.push(this.article)
          })    
    },
    getNewArticle() {
      this.article = {
        id: 0,
        name: '',
        content: ''
      }
      this.editMode = true
    },
    delArticle() {
      this.axios.delete("api/article?id="+this.article.id).then(() => {
        this.getArticles()
        this.editMode = false
        this.article = null
      })
    }
  },
  created() {
    this.getArticles()
  }
}
</script>
