import cv2
from ultralytics import YOLO

# Load YOLOv8 model with tracking enabled
model = YOLO('yolov8s.pt', task='track')

# Load video
cap = cv2.VideoCapture('/Cars.mp4')

# Get video properties
frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
fps = int(cap.get(cv2.CAP_PROP_FPS))

# Define the codec and create VideoWriter object
output_path = 'output_with_lines_and_counts.mp4'
fourcc = cv2.VideoWriter_fourcc(*'mp4v')  # Codec for MP4 format
out = cv2.VideoWriter(output_path, fourcc, fps, (frame_width, frame_height))

# Define the coordinates for the left and right lines
line_left = (30, 300, 370, 300)  # Green line
line_right = (540, 300, 830, 300)  # Red line

# Counters for vehicle crossings
crossings_left = 0
crossings_right = 0

# Dictionary to store vehicle positions and their crossing status
vehicle_positions = {}
crossed_left = set()  # Vehicles that crossed the green line
crossed_right = set()  # Vehicles that crossed the red line

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # Perform object detection and tracking
    results = model.track(source=frame, persist=True, conf=0.5)

    for result in results:
        for box in result.boxes:
            # Extract bounding box coordinates and label
            x1, y1, x2, y2 = map(int, box.xyxy[0])  # Bounding box coordinates
            label = result.names[int(box.cls[0])]  # Class label
            confidence = box.conf[0]  # Confidence score

            # Check if the detected object is a car or truck
            if label in ['car', 'truck'] and confidence > 0.5:
                vehicle_center_x = int((x1 + x2) / 2)
                vehicle_center_y = int((y1 + y2) / 2)

                # Use ID from YOLO tracking
                if box.id is not None:
                    obj_id = int(box.id[0])

                    if obj_id not in vehicle_positions:
                        vehicle_positions[obj_id] = (vehicle_center_x, vehicle_center_y)
                    else:
                        prev_x, prev_y = vehicle_positions[obj_id]

                        # Check if the vehicle crosses the left line (green line)
                        if obj_id not in crossed_left and line_left[0] <= vehicle_center_x <= line_left[2]:
                            # Moving downward (toward the camera)
                            if prev_y < line_left[1] and vehicle_center_y >= line_left[1]:
                                crossings_left += 1
                                crossed_left.add(obj_id)  # Mark as crossed

                        # Check if the vehicle crosses the right line (red line)
                        if obj_id not in crossed_right and line_right[0] <= vehicle_center_x <= line_right[2]:
                            # Moving upward (away from the camera)
                            if prev_y > line_right[1] and vehicle_center_y <= line_right[1]:
                                crossings_right += 1
                                crossed_right.add(obj_id)  # Mark as crossed

                        # Update position
                        vehicle_positions[obj_id] = (vehicle_center_x, vehicle_center_y)

                # Draw bounding box and label
                cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 0), 2)
                cv2.putText(frame, f"ID {obj_id}", (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)

    # Draw the lines
    cv2.line(frame, (line_left[0], line_left[1]), (line_left[2], line_left[3]), (0, 255, 0), 3)  # Green line
    cv2.line(frame, (line_right[0], line_right[1]), (line_right[2], line_right[3]), (0, 0, 255), 3)  # Red line

    # Display the counts
    cv2.putText(frame, f'Left line crossings (toward camera): {crossings_left}', (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    cv2.putText(frame, f'Right line crossings (away from camera): {crossings_right}', (10, 100), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

    # Write the frame to the output video
    out.write(frame)

    # Display the frame (optional, you can comment this for faster execution)
    cv2.imshow('Frame', frame)

    # Break on 'q' key press
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
out.release()
cv2.destroyAllWindows()

print(f"Video saved to {output_path}")