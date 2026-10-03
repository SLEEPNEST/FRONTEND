import re

with open('src/pages/OrderDetailPage.css', 'r') as f:
    content = f.read()

old_timeline = """.od-timeline {
  display: flex;
  flex-direction: column;
  position: relative;
  margin-left: 8px;
  margin-bottom: 24px;
}
.od-timeline::before {
  content: '';
  position: absolute;
  top: 8px;
  bottom: 8px;
  left: 5px;
  width: 2px;
  background: #26a541;
}
.od-timeline-step {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}
.od-timeline-step:last-child {
  margin-bottom: 0;
}
.od-step-icon {
  width: 12px;
  height: 12px;
  background: #26a541;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px #26a541;
}"""

new_timeline = """.od-timeline {
  display: flex;
  flex-direction: column;
  position: relative;
  margin-left: 8px;
  margin-bottom: 24px;
}
.od-timeline::before {
  content: '';
  position: absolute;
  top: 8px;
  bottom: 8px;
  left: 5px;
  width: 2px;
  background: #e0e0e0;
}
.od-timeline-step {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  position: relative;
  z-index: 1;
}
.od-timeline-step:last-child {
  margin-bottom: 0;
}

/* Connection line between steps */
.od-timeline-step::before {
  content: '';
  position: absolute;
  top: 14px;
  left: 5px;
  width: 2px;
  height: 32px;
  background: #e0e0e0;
  z-index: -1;
}
.od-timeline-step:last-child::before {
  display: none;
}
.od-timeline-step.completed::before {
  background: #26a541;
}

.od-step-icon {
  width: 12px;
  height: 12px;
  background: #fff;
  border-radius: 50%;
  border: 2px solid #e0e0e0;
}
.od-timeline-step.completed .od-step-icon {
  background: #26a541;
  border-color: #fff;
  box-shadow: 0 0 0 1px #26a541;
}
.od-timeline-step.pending .od-step-text {
  color: #878787;
}"""

content = content.replace(old_timeline, new_timeline)

with open('src/pages/OrderDetailPage.css', 'w') as f:
    f.write(content)

