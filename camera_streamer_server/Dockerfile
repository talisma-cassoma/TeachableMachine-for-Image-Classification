# Use ubuntu:latest as the base image
FROM ubuntu:latest

# Install necessary system dependencies
 RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    ca-certificates \
    wget \
    libsm6 \
    libxext6 \
    libxrender-dev \
    python3.6 \
    && rm -rf /var/lib/apt/lists/*

# Install Anaconda
RUN wget --quiet https://repo.anaconda.com/archive/Anaconda3-2021.11-Linux-x86_64.sh -O ~/anaconda.sh \
    && /bin/bash ~/anaconda.sh -b -p /opt/conda \
    && rm ~/anaconda.sh

# Add conda to the system PATH
ENV PATH /opt/conda/bin:$PATH

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the environment.yml file
# COPY environment.yml .

# Create a conda environment
# RUN apt-get update && apt-get install -y libspatialindex-dev libyaml-dev python3-numpy python3-sklearn libmkl-random-dev python3-matplotlib libssl-dev libiconv-dev libtiff-dev libmkl-dev python3-sip-dev libfreetype-dev llvm-11-dev python3-jupyter-core libintel-openmp-dev python3-astor python3-pip xz-utils ca-certificates gettext libhdf5-dev python3-psutil libprotobuf-dev python3-tensorboard libpng-dev libreadline-dev python3-cryptography libsodium-dev tk-dev libjpeg-dev python3-pillow python3-brotlipy python3-keyring python3-appnope python3-certifi python3-pandocfilters python3-scipy python3-markdown python3-grpcio python3-tensorflow python3-matplotlib-base python3-ujson python3-pyrsistent libmkl-service-dev libdbus-1-dev liblcms2-dev python3-yaml libsqlite3-dev pandoc qt5-default libzstd-dev libedit-dev python3-pysocks zlib1g-dev libexpat1-dev python3-tornado python3-mkl-fft python3-wrapt python3-cffi libicu-dev python3-setuptools python3-lazy-object-proxy python3-pyqt5 libncurses-dev libc-ares-dev libgfortran3 python3-watchdog libhdf5-103
# RUN conda env create -f environment.yml
# Install required packages
RUN pip install --no-cache-dir \
    imagezmq==1.1.1 \
    opencv-python \
    # pyzmq==22.0.2

# Activate the conda environment
RUN echo "source activate $(head -1 environment.yml | cut -d' ' -f2)" > ~/.bashrc
ENV PATH /opt/conda/envs/$(head -1 environment.yml | cut -d' ' -f2)/bin:$PATH
RUN /bin/bash -c "source ~/.bashrc"

# Upgrade pip
# RUN pip install --no-cache-dir --upgrade pip

# Copy the current directory contents into the container
COPY . .

# Run create_streamer.py when the container launches
CMD ["python", "./create_streamer.py"]