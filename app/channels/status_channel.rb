class StatusChannel < ApplicationCable::Channel
  def subscribed
    stream_from "StatusChannel_#{params[:id]}"
    update_status
  end

  def unsubscribed
    update_status
  end

  def receive(data)
    update_status
  end

  private
  def update_status
    guide = Guide.find(params[:id])
    if(guide)
      ActionCable.server.broadcast("StatusChannel_#{params[:id]}",
        {active: guide.status, followers: Follower.where("guide_id = #{guide.id}").length})
    end
  end
end
