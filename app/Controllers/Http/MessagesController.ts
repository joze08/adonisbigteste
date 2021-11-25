import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Message from 'App/Models/Message'

export default class MessagesController {
  public async index({ }: HttpContextContract) {
    const messages = await Message.query().preload('user');
    return messages;
  }

  public async store({ request, response, auth }: HttpContextContract) {
    try {
      const data = request.only(["texto"]);
      const message = await Message.create({ ...data, userId: auth.user?.id });
      return message;
    } catch (error) {
      response.status(500).send("Erro ao enviar a mensagem");
    }
  }

  public async show({ params }: HttpContextContract) {
    const message = await Message.findOrFail(params.id);
    return message;
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {
      const message = await Message.findOrFail(params.id);
      const { texto } = request.only(["texto"]);
      message.texto = texto;
      await message.save();
      return message;
    } catch (error) {
      response.status(500).send("Erro ao atualizar a mensagem");
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const message = await Message.findOrFail(params.id);
      await message.delete()
      return message;
    } catch (error) {
      response.status(500).send("Erro ao apagar a mensagem!")
    }
  }
}
