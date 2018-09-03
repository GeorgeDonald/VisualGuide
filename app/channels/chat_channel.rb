class ChatChannel < ApplicationCable::Channel
  def subscribed
    stream_from "ChatChannel_#{params[:id]}"
  end

  def receive(data)
    guide = Guide.find(params[:id])
    if(guide)
      msg = verified_user.messages.create!(message: data['message'], guide_id: guide.id)
      data['user_name'] = verified_user.full_name
      data['avatar_url'] = verified_user.avatar.url(:thumb)
      data['message_time'] = msg.updated_at
      ActionCable.server.broadcast("ChatChannel_#{params[:id]}",data)
    end
  end

  private

end
