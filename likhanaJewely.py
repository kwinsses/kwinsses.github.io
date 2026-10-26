import json
import os
from datetime import datetime

from flask import Flask, request, jsonify, render_template, abort, send_from_directory


def save_orders(orders, filename):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(orders, f, indent=4, ensure_ascii=False)


def load_orders(filename):
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf-8') as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return []
    return []


BASE_DIR = os.path.dirname(__file__)
ORDERS_FILE = os.path.join(BASE_DIR, 'order.json')
orders = load_orders(ORDERS_FILE)

# Use default static URL path so page routes are not intercepted by root-level static routing
app = Flask(__name__, static_folder='static', template_folder='templates')


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/orders', methods=['GET'])
def list_orders():
    return jsonify(orders)


@app.route('/<path:page>')
def render_page(page):
    # Prevent directory traversal
    if '..' in page or page.startswith('/'):
        abort(404)

    # Try exact file in templates
    templates_dir = os.path.join(BASE_DIR, 'templates')
    candidate = os.path.join(templates_dir, page)
    if os.path.exists(candidate) and os.path.isfile(candidate):
        return render_template(page)

    # Try with .html appended
    if not page.endswith('.html'):
        candidate_html = candidate + '.html'
        if os.path.exists(candidate_html) and os.path.isfile(candidate_html):
            return render_template(page + '.html')

    # Case-insensitive fallback: find a template file that matches ignoring case
    try:
        for fname in os.listdir(templates_dir):
            if fname.lower() == page.lower() or fname.lower() == (page + '.html').lower():
                return render_template(fname)
    except OSError:
        pass

    abort(404)


@app.route('/images/<path:filename>')
def template_images(filename):
    images_dir = os.path.join(BASE_DIR, 'templates', 'images')
    return send_from_directory(images_dir, filename)


# Additional cart routes to support different cart link variants
@app.route('/cart')
def cart_short():
    return render_template('addToCart.html')


@app.route('/addtocart.html')
def addtocart_lower():
    return render_template('addToCart.html')


@app.route('/addToCart')
def addtocart_noext():
    return render_template('addToCart.html')


@app.route('/checkout', methods=['POST'])
def checkout():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No JSON body received'}), 400

    cart = data.get('cart')
    if not cart:
        return jsonify({'error': 'Cart is empty'}), 400

    normalized_cart = []
    for item in cart:
        normalized_cart.append({
            'name': item.get('name'),
            'image': item.get('image'),
            'price': item.get('price'),
            'quantity': item.get('quantity', 1),
            'size': item.get('size', '')
        })

    new_order = {
        'id': len(orders) + 1,
        'timestamp': datetime.utcnow().isoformat() + 'Z',
        'cart': normalized_cart
    }

    orders.append(new_order)
    save_orders(orders, ORDERS_FILE)

    return jsonify({'status': 'success', 'order': new_order}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
