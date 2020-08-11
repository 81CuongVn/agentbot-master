module.exports = {
    name: "say",
    category: "fun",
    description: "Nói theo bạn",
    run: async(client, message, args) => {
    let args = message.content.split(" ").slice(1);
    message.delete();
    if (message.content.includes("@everyone")  || message.content.includes("@here")) return message.channel.send("Bạn không thể làm tôi đề cập @everyone đâu :)!");
    message.channel.send(args.join(" ")).cleanContent;
     }
}
