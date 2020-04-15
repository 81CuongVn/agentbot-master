const { MessageEmbed } = require("discord.js");
const randomPuppy = require("random-puppy");

module.exports = {
    name: "food",
    category: "images",
    description: "Gởi ảnh thức ăn từ reddit",
    usage: "_food",
    run: async(client, message, args) => {
        const subReddits = ["appetizers", "asianeats", "BBQ", "bento", "BreakfastFood", "burgers", "cakewin", "Canning", "cereal", "charcuterie", "Cheese", "chinesefood", "cider", "condiments", "curry", "culinaryplating", "cookingforbeginners", "cookingwithcondiments", "doener", "eatwraps", "fastfood", "fishtew", "fried", "GifRecipes", "grease", "hot_dog", "icecreamery", "irish_food", "JapaneseFood", "jello", "KoreanFood", "FoodPorn", "meat", "pasta", "pizza", "ramen", "seafood", "spicy", "steak", "sushi", "sushiroll", 'Vitamix'];
        const random = subReddits[Math.floor(Math.random() * subReddits.length)];

        const img = await randomPuppy(random);
        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setImage(img)
            .setTitle(`From /r/${random}`)
            .setURL(`https://reddit.com/r/${random}`);

        message.channel.send(embed);
    }
}