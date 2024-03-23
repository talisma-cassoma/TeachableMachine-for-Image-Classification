FROM continuumio/miniconda3

# Install OpenCV
RUN conda install -c conda-forge opencv --yes

# Install imagezmq
RUN pip install imagezmq 

# Copy the code into the container
COPY create_streamer.py /app/create_streamer.py

# Set the working directory
WORKDIR /app

# Run the script
CMD ["python", "create_streamer.py"]
