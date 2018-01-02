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
    if(guide)
      if(guide.user_id === verified_user.id)
        guide.status=act
        guide.save
      else
        fo = Follower.where("guide_id = #{guide.id} and user_id = #{verified_user.id}")
        if(act)
          if(fo.empty?)
            Follower.create(guide_id: params[:id], user_id:verified_user.id)
          end
        else
          fo.delete_all
        end
      end
      ActionCable.server.broadcast("StatusChannel_#{params[:id]}",
        {active: guide.status, followers: Follower.where("guide_id = #{guide.id}").length})
    end
  end
end
