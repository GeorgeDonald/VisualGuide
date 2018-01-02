class GuideChannel < ApplicationCable::Channel
  def subscribed
    activateChannel(true)
    stream_from "GuideChannel_#{params[:id]}"
  end

  def unsubscribed
    activateChannel(false)
  end

  def receive(data)
    guide = Guide.find(params[:id])
    if(guide && guide.user_id === verified_user.id)
      ActionCable.server.broadcast("GuideChannel_#{params[:id]}", data)
    end
  end

  private
  def activateChannel(act)
    guide = Guide.find(params[:id])
    if(guide && guide.user_id === verified_user.id)
      guide.status=act
      guide.save
    end
  end
end
