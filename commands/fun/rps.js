module.exports = {
    name: "rps",
    category: "fun",
    description: "Chơi kéo búa bao",
let rps = ["**:pencil: bao**", "**:moyai: búa**", "**:scissors: kéo**"];
function random() { return `${rps[Math.floor(Math.random() * Math.floor(2))]}!` }
run: async(client, msg, args) => {
    let choice = args.join(" ").toLowerCase();
    if (choice === '') return msg.reply("Vui lòng chọn kéo búa hoặc bao.");
    if (choice !== "kéo" && choice !== "búa" && choice !== "bao") return msg.reply(`Vui lòng chọn kéo búa hoặc bao. ${choice} n :P`);
    msg.reply(random());
     }
}
