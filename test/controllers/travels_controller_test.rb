require 'test_helper'

class TravelsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get travels_index_url
    assert_response :success
  end

  test "should get new" do
    get travels_new_url
    assert_response :success
  end

  test "should get edit" do
    get travels_edit_url
    assert_response :success
  end

end
