const SaveRecipePage = {
  template: `<loader />`,
  created() {
    this.saveRecipe()
  },
  data() {
    return {
      url: ''
    }
  },
  methods: {
    async saveRecipe() {
      // Set the URL to scrape from the query parameters
      this.url = this.$route.query.url;
  
      try {
        // Wait for the scraping to complete
        let recipe = await this.$store.scrapeRecipe(this.url);
  
        // Assuming addRecipe is an asynchronous action, wait for it to complete
        let createdRecipe = await this.$store.addRecipe(recipe);
        console.log(createdRecipe)
  
        // After adding the recipe, navigate to the '/app' route
        this.$router.replace(`/app/recipe/${createdRecipe.id}`);
      } catch (error) {
        console.error("An error occurred while saving the recipe:", error);
        // Handle any errors that might occur during scraping or adding the recipe
      }
    }
  }
}

export default SaveRecipePage
