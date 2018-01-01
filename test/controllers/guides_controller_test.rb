require 'test_helper'

class GuidesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get guides_index_url
    assert_response :success
  end

  test "should get show" do
    get guides_show_url
    assert_response :success
  end

  test "should get new" do
    get guides_new_url
    assert_response :success
  end

  test "should get create" do
    get guides_create_url
    assert_response :success
  end

end
