class ChatChannel < ApplicationCable::Channel
  def subscribed
    stream_from "ChatChannel_#{params[:id]}"
  end

  def receive(data)
    guide = Guide.find(params[:id])
    if(guide)
      data['user_name'] = verified_user.full_name
      data['avatar_url'] = verified_user.avatar.url(:thumb)
      ActionCable.server.broadcast("ChatChannel_#{params[:id]}",data)
    end
  end

  private

end
