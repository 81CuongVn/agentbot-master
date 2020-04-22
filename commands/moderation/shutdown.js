module.exports = {
    name: "shutdown",
    aliases: ["tatbot"],
    description: "Shutdown the bot",
    usage: "shutdown",
    note: "Lệnh dành riêng cho owner của bot.",
    run: async(client, message, args) => {
        if (message.author.id != "455935236262592512") return message.channel.send("Lệnh này dành riêng cho chủ của bot.")
        try {
            await message.channel.send("Đã tắt bot từ xa!")
            process.exit()
        } catch (e) {
            message.channel.send(`Bot lỗi: ${e.message}`)
        }
    }
}