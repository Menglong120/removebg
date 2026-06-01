import os
from flask import Flask, flash, redirect, render_template, request, send_file, url_for
from PIL import Image

try:
    from rembg import remove
except Exception as exc:
    raise RuntimeError(
        'rembg backend not available. Install with `pip install "rembg[cpu]"` or `pip install "rembg[gpu]"`.'
    ) from exc

UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'output'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['OUTPUT_FOLDER'] = OUTPUT_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH
app.secret_key = 'replace-with-a-secure-key'

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        if 'image' not in request.files:
            flash('No file part')
            return redirect(request.url)

        file = request.files['image']
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)

        if file and allowed_file(file.filename):
            filename = file.filename
            upload_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(upload_path)

            output_path = os.path.join(app.config['OUTPUT_FOLDER'], f'removed_{filename.rsplit(".", 1)[0]}.png')
            with open(upload_path, 'rb') as input_file:
                image_data = input_file.read()

            result = remove(image_data)
            with open(output_path, 'wb') as output_file:
                output_file.write(result)

            return redirect(url_for('download', filename=os.path.basename(output_path)))

        flash('Invalid file format. Use PNG or JPG/JPEG.')
        return redirect(request.url)

    return render_template('index.html')


@app.route('/download/<filename>')
def download(filename):
    path = os.path.join(app.config['OUTPUT_FOLDER'], filename)
    if not os.path.exists(path):
        flash('File not found')
        return redirect(url_for('index'))
    return send_file(path, as_attachment=True)


if __name__ == '__main__':
    app.run(debug=True, port=5000)
