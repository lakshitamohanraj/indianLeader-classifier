from flask import Flask, jsonify,request
import util
app=Flask(__name__)

@app.route('/classify_image',methods=['GET','POST'])
def classify_image():
    image_data=request.form['image_data']
    response=jsonify(util.classify_image(image_data))
    
    response.headers.add('Access-Control-Allow-Origin','*')
    
    return response
    
if __name__=="__main__":
    util.load_saved_artifacts()
    app.run(host="0.0.0.0",port=5000)