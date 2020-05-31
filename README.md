# Something Awesome: SPHINX
### a password Store which Perfectly Hides from Itself (No eXaggeration)
This repo contains the work I have done creating the SPHINX protocol in the paper for a password store system. This protocol makes use of device enhanced key encryption, and does not rely on public key infrastructure. The core idea is that this device can be malicious or be hacked with a MitM attack, and an attacker will learn nothing from the device. One of the out of scope goals in the paper was hosting the device on the web, to fully take advantage of the protocol. This implementation is a proof of concept of this goal.

### [Youtube Live Demo](https://www.youtube.com/watch?v=jta72Zj-l14)

## Folder structure
This repository holds a few smaller projects, which together form SPHINX.
- `api`
    - Python implementation of the backend webserver
- `extension`
    - Javascript + React frontend chrome extension

### `algorithm_overview.ipynb`
This is an interactive jupyter notebook I wrote which details the implementation of SPHINX in python, built upon the Elliptic Curve Library from the python package `ecdsa`. You can run through the entire notebook to get an understanding of how exactly SPHINX works.

## How to run
### python
1. install the `requirements.txt` file with pip3 for python3.
```
pip install -r requirements.txt
```
2. go into the `api` folder, and run the flask application.
```
cd api; python api.py
```
3. In a new terminal, go into the `extension` folder, and install required dependencies
```
cd extension; yarn
```
4. Build the code using the supplied yarn script in package.json
```
yarn buildExtension
```
5. Go into Chrome, turn on developer mode, and click the "Load unpacked" button, and select the built `dist` folder.
6. OPTIONAL: in the root dir, run the python notebook (requires jupyter notebook, which recommends installing `conda`. If you are a seasoned python expert, then just pip install it)
```
jupyter notebook
```
