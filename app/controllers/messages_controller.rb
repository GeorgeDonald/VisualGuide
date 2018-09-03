class MessagesController < ApplicationController
  before_action :authenticate_user!

  def index
    if(params[:request] == "query" && params[:guide_id])
      result = []
      messages = Message.where("guide_id=#{params[:guide_id]}").order(:updated_at)
      messages.each do |m|
        result.push(m.id)
      end
      render :json => {result: result}
    elsif(params[:request] == "get" && params[:message_id])
      result = {}
      message=Message.find(params[:message_id])
      if(message)
        user = User.find(message.user_id)
        result['message'] = message.message
        result['user_name'] = user.full_name
        result['avatar_url'] = user.avatar.url(:thumb)
        result['message_time'] = message.updated_at
      end
      render :json => result
    else
      render :json => {}
    end
  end

end
