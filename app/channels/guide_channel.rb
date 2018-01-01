class GuideChannel < ApplicationCable::Channel
  def subscribed
    stream_from "GuideChannel_#{params[:id]}"
  end

  def unsubscribed
  end

  def receive(data)
     ActionCable.server.broadcast("GuideChannel_#{params[:id]}", data)
  end
end
