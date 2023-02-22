const { KeepAlive } = require("./keep_alive")
require('dotenv').config()
const { Configuration, OpenAIApi } = require("openai");
const { getImage, getChat } = require("./Helper/functions");
const { Telegraf } = require("telegraf");

const configuration = new Configuration({
  apiKey: process.env.API,
});
const openai = new OpenAIApi(configuration);
module.exports = openai;

const bot = new Telegraf(process.env.TG_API);
bot.start((ctx) => ctx.reply("✨Bienvenido✨ , Puedes preguntarme cualquier cosa /help para ver la lista de comandos.🤖"));

bot.help((ctx) => {
  ctx.reply(
    "Este bot puede ejecutar el siguiente comando \n /image -> para crear una imagen a partir de texto \n /ask -> preguntarme cualquier cosa "
  );
});



// Image command
bot.command("image", async (ctx) => {
  const text = ctx.message.text?.replace("/image", "")?.trim().toLowerCase();

  if (text) {
   
    const res = await getImage(text);

    if (res) {
      ctx.sendChatAction("upload_photo");
      // ctx.sendPhoto(res);
      // ctx.telegram.sendPhoto()
      ctx.telegram.sendPhoto(ctx.message.chat.id, res, {
        reply_to_message_id: ctx.message.message_id,
      });
    }
  } else {
    ctx.telegram.sendMessage(
      ctx.message.chat.id,
      "Tienes que dar alguna descripción después /image",
      {
        reply_to_message_id: ctx.message.message_id,
      }
    );
  }
});

// Chat command

bot.command("ask", async (ctx) => {
  const text = ctx.message.text?.replace("/ask", "")?.trim().toLowerCase();

  if (text) {
    ctx.sendChatAction("typing");
    const res = await getChat(text);
    if (res) {
      ctx.telegram.sendMessage(ctx.message.chat.id, res, {
        reply_to_message_id: ctx.message.message_id,
      });
    }
  } else {
    ctx.telegram.sendMessage(
      ctx.message.chat.id,
      "Por favor pregunte cualquier cosa después de /ask",
      {
        reply_to_message_id: ctx.message.message_id,
      }
    );
  
    //  reply("Please ask anything after /ask");
  }
});



bot.launch();

