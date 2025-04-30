# Base image
FROM ubuntu:18.04

ENV PATH="/root/miniconda3/bin:${PATH}"
ARG PATH="/root/miniconda3/bin:${PATH}"

# Install wget to fetch Miniconda
RUN apt-get update && \
    apt-get install -y wget && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Miniconda on x86 or ARM platforms
RUN arch=$(uname -m) && \
    if [ "$arch" = "x86_64" ]; then \
    MINICONDA_URL="https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh"; \
    elif [ "$arch" = "aarch64" ]; then \
    MINICONDA_URL="https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-aarch64.sh"; \
    else \
    echo "Unsupported architecture: $arch"; \
    exit 1; \
    fi && \
    wget $MINICONDA_URL -O miniconda.sh && \
    mkdir -p /root/.conda && \
    bash miniconda.sh -b -p /root/miniconda3 && \
    rm -f miniconda.sh

RUN conda --version

# Define working directory
WORKDIR /app

# Copy environment YAML file and install dependencies
COPY conda_environment/environment.yml /app/environment.yml
RUN conda env create -f /app/environment.yml

# Activate the environment
SHELL ["conda", "run", "-n", "multi_cam_tracking", "/bin/bash", "-c"]

# Copy application files
COPY object_counting /app/object_counting

# Set the entrypoint command
CMD ["conda", "run", "-n", "multi_cam_tracking", "python", "object_counting/app.py"]
