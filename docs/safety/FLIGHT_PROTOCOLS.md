# Flight Test Protocols and Procedures

**Project**: ECE496 Indoor UWB-Based Drone Localization  
**Document Version**: 1.0  
**Date**: 2025-06-25  
**Approval Required**: Safety Officer, Faculty Advisor

## 1. Flight Authorization Framework

### 1.1 Authorization Levels

| Level | Authority | Flight Envelope | Requirements |
|-------|-----------|-----------------|--------------|
| **Level 0** | Individual | Tethered/Ground | Basic safety training |
| **Level 1** | Safety Officer | Indoor, <2m altitude | Full safety certification |
| **Level 2** | Faculty Advisor | Indoor, <4m altitude | Advanced pilot training |
| **Level 3** | Department Head | Restricted outdoor | Special authorization |

### 1.2 Flight Authorization Process

**For Level 1-2 Operations:**
1. Submit flight request 24 hours in advance
2. Complete pre-flight safety checklist
3. Obtain safety officer approval
4. Brief all personnel on flight plan
5. Conduct pre-flight inspection
6. Execute flight with continuous monitoring

**Required Documentation:**
- [ ] Flight plan with objectives
- [ ] Risk assessment and mitigation
- [ ] Personnel qualifications
- [ ] Emergency procedures review
- [ ] Equipment inspection records

## 2. Pre-Flight Procedures

### 2.1 Environmental Assessment

**Indoor Environment Checklist:**
- [ ] Room dimensions adequate (min 6m x 6m x 4m)
- [ ] Ceiling clear of obstacles and fixtures
- [ ] Floor clear of personnel and equipment
- [ ] Adequate lighting (min 500 lux)
- [ ] Temperature within operating range (15-30°C)
- [ ] Humidity <70% RH
- [ ] Air circulation adequate for battery safety

**Safety Zone Establishment:**
- [ ] Primary flight zone marked (3m radius minimum)
- [ ] Secondary safety zone marked (5m radius)
- [ ] Emergency landing zone designated
- [ ] Spectator area defined and marked
- [ ] Emergency exits identified and clear

### 2.2 Personnel Briefing

**Required Attendees:**
- Flight operator (certified)
- Safety observer (trained)
- Technical lead (if testing new features)
- Additional personnel as needed

**Briefing Topics:**
- [ ] Flight objectives and timeline
- [ ] Safety procedures and emergency actions
- [ ] Role assignments and responsibilities
- [ ] Communication protocols
- [ ] Abort conditions and procedures

### 2.3 Equipment Inspection

**Drone System:**
- [ ] Visual inspection for damage or wear
- [ ] Propeller attachment and condition
- [ ] Motor mounting and security
- [ ] Battery level and condition (>80% charge)
- [ ] All connections secure and clean
- [ ] Firmware version verified
- [ ] Calibration status current

**Support Equipment:**
- [ ] Emergency stop system functional
- [ ] Communication links tested
- [ ] UWB anchor system operational
- [ ] Ground station computer ready
- [ ] Fire safety equipment available
- [ ] First aid kit accessible

## 3. Flight Execution Procedures

### 3.1 System Startup Sequence

**Power-On Sequence:**
1. **Ground station** - Power on and verify systems
2. **UWB anchors** - Initialize and verify positioning
3. **Safety systems** - Test emergency stop functionality
4. **Drone systems** - Power on flight controller
5. **Communication** - Establish and verify all links
6. **Sensors** - Calibrate and verify all sensors
7. **Final check** - Complete system status verification

**Verification Steps:**
- [ ] All systems reporting normal status
- [ ] GPS/positioning system locked (if applicable)
- [ ] IMU calibrated and stable
- [ ] Communication latency <100ms
- [ ] Emergency stop tested and functional
- [ ] Battery levels acceptable for planned flight

### 3.2 Takeoff Procedures

**Pre-Takeoff:**
- [ ] Final personnel check - all in safe positions
- [ ] Announce "PREPARING FOR TAKEOFF"
- [ ] Arm motors with safety confirmation
- [ ] Verify flight control responsiveness
- [ ] Check emergency stop one final time

**Takeoff Execution:**
1. **Announce** "TAKEOFF INITIATED"
2. **Throttle up** slowly and steadily
3. **Maintain position** at 0.5m altitude initially
4. **Verify stability** and control response
5. **Check all systems** before proceeding
6. **Announce** "HOVER ESTABLISHED"

### 3.3 Flight Operations

**Normal Flight Procedures:**
- Maintain continuous visual contact
- Monitor all system parameters continuously
- Execute planned flight path only
- Maintain altitude limits per authorization level
- Keep emergency stop within immediate reach
- Communicate position and status regularly

**Prohibited Actions:**
- Flight outside designated area
- Exceeding authorized altitude
- Aggressive maneuvers without specific authorization
- Flight with system warnings or degraded performance
- Operations without safety observer present

### 3.4 Landing Procedures

**Normal Landing:**
1. **Navigate** to designated landing zone
2. **Announce** "INITIATING LANDING"
3. **Descend** slowly and maintain position
4. **Reduce throttle** gradually to touchdown
5. **Disarm motors** immediately upon contact
6. **Announce** "LANDING COMPLETE - MOTORS DISARMED"

**Emergency Landing:**
1. **Announce** "EMERGENCY LANDING"
2. **Clear** nearest suitable landing area
3. **Execute** rapid but controlled descent
4. **Prepare** for hard landing if necessary
5. **Disarm** motors immediately after contact
6. **Assess** situation and respond accordingly

## 4. Flight Test Categories

### 4.1 Basic Function Tests

**Objectives:**
- Verify basic flight control systems
- Test communication and telemetry
- Validate emergency procedures
- Confirm system integration

**Test Procedures:**
- [ ] Hover stability test (5 minutes)
- [ ] Basic movement test (forward/back, left/right)
- [ ] Altitude hold test
- [ ] Emergency stop test
- [ ] Communication range test
- [ ] Battery endurance test

**Success Criteria:**
- Stable hover with <10cm drift
- Responsive control in all axes
- Emergency stop functional in <2 seconds
- Communication maintained throughout
- Battery performance meets specifications

### 4.2 Localization System Tests

**Objectives:**
- Validate UWB positioning accuracy
- Test sensor fusion algorithms
- Verify coordinate system alignment
- Assess positioning update rates

**Test Procedures:**
- [ ] Static positioning accuracy test
- [ ] Dynamic positioning test
- [ ] Multi-anchor ranging validation
- [ ] Coordinate system calibration
- [ ] Real-time positioning display

**Success Criteria:**
- Static accuracy <10cm (95% confidence)
- Dynamic accuracy <20cm during movement
- Position update rate >10Hz
- No significant drift over time
- Coordinate alignment within 5 degrees

### 4.3 Obstacle Avoidance Tests

**Objectives:**
- Test RL-based obstacle avoidance
- Validate sensor integration
- Verify safety margins
- Assess algorithm performance

**Test Setup:**
- [ ] Known obstacle placement
- [ ] Sensor calibration verification
- [ ] Safety barriers in place
- [ ] Multiple escape routes available

**Test Procedures:**
- [ ] Static obstacle detection
- [ ] Dynamic obstacle approach
- [ ] Avoidance maneuver execution
- [ ] Path re-planning validation
- [ ] Emergency override testing

**Success Criteria:**
- Obstacle detection at >2m distance
- Successful avoidance maneuvers
- Smooth path re-planning
- No collisions during testing
- Emergency override functional

## 5. Emergency Procedures During Flight

### 5.1 Loss of Control

**Immediate Actions:**
1. **EMERGENCY STOP** - Activate immediately
2. **ANNOUNCE** "LOSS OF CONTROL"
3. **CLEAR AREA** - All personnel to safe zones
4. **MONITOR** for automatic recovery systems
5. **ASSESS** situation once safe

**Follow-up:**
- Do not approach until motors completely stopped
- Inspect for damage before handling
- Download flight logs for analysis
- Complete incident report
- Do not restart without safety approval

### 5.2 System Failures

**Communication Loss:**
- Drone should activate automatic failsafe
- Monitor for return-to-home behavior
- Clear anticipated flight path
- Prepare for emergency landing
- Be ready to intervene if needed

**Sensor Failures:**
- GPS/positioning: Switch to manual control if safe
- IMU: Immediate emergency landing required
- Battery: Land immediately regardless of mission
- Motor: Clear area and prepare for crash landing

### 5.3 Environmental Hazards

**Unexpected Obstacles:**
- Activate obstacle avoidance if equipped
- Manual override to safe direction
- Emergency stop if collision imminent
- Clear area and assess damage

**Personnel in Flight Zone:**
- Immediate emergency stop
- Announce "PEOPLE IN FLIGHT ZONE"
- Do not resume until area clear
- Brief all personnel on safety zones

## 6. Post-Flight Procedures

### 6.1 Shutdown Sequence

**Power-Down Sequence:**
1. **Disarm** motors and confirm stopped
2. **Power down** drone electronics
3. **Disconnect** battery safely
4. **Power down** ground station
5. **Secure** UWB anchor system
6. **Store** equipment properly

### 6.2 Equipment Inspection

**Post-Flight Inspection:**
- [ ] Visual inspection for damage
- [ ] Propeller condition and attachment
- [ ] Motor temperature and mounting
- [ ] Battery condition and temperature
- [ ] Connection integrity
- [ ] Log any anomalies found

**Data Collection:**
- [ ] Download flight logs
- [ ] Save telemetry data
- [ ] Record performance metrics
- [ ] Note any system warnings
- [ ] Document test results

### 6.3 Documentation

**Required Documentation:**
- [ ] Flight log with duration and objectives
- [ ] System performance data
- [ ] Any anomalies or issues encountered
- [ ] Test results and analysis
- [ ] Maintenance items identified
- [ ] Next flight recommendations

## 7. Maintenance and Inspection

### 7.1 Daily Inspection (Pre-Flight)

**Visual Inspection:**
- [ ] Frame integrity and mounting
- [ ] Propeller condition and security
- [ ] Wire routing and connections
- [ ] Component mounting security
- [ ] Battery condition and charge level

**Functional Testing:**
- [ ] Motor startup and response
- [ ] Control surface movement
- [ ] Sensor readings verification
- [ ] Communication link quality
- [ ] Emergency stop functionality

### 7.2 Weekly Inspection

**Detailed Inspection:**
- [ ] Torque check all fasteners
- [ ] Deep clean all components
- [ ] Calibrate sensors if needed
- [ ] Test backup systems
- [ ] Update firmware if available
- [ ] Review flight logs for trends

### 7.3 Monthly Inspection

**Comprehensive Testing:**
- [ ] Full system calibration
- [ ] Performance benchmarking
- [ ] Wear item replacement
- [ ] Safety equipment verification
- [ ] Documentation review
- [ ] Training updates if needed

## 8. Training and Certification

### 8.1 Pilot Certification Levels

**Basic Operator:**
- Classroom safety training
- Supervised flight training (10 hours)
- Written exam (80% pass rate)
- Practical flight test
- Annual recertification required

**Advanced Operator:**
- Basic operator certification
- Additional technical training
- Autonomous system operation
- Emergency procedure proficiency
- Test pilot authorization

### 8.2 Safety Observer Certification

**Requirements:**
- Safety training completion
- Emergency procedure knowledge
- Communication protocol training
- Incident response training
- Annual recertification

### 8.3 Ongoing Training

**Monthly Training:**
- Safety procedure review
- Emergency response drills
- New procedure training
- Incident analysis review

**Annual Requirements:**
- Full safety training refresh
- Emergency procedure testing
- Equipment update training
- Regulatory compliance review

## 9. Quality Assurance

### 9.1 Flight Data Analysis

**Required Analysis:**
- Performance metrics tracking
- System health monitoring
- Trend analysis for degradation
- Comparison with specifications
- Anomaly identification and investigation

### 9.2 Continuous Improvement

**Regular Reviews:**
- Monthly performance reviews
- Quarterly procedure updates
- Annual safety assessment
- Incident-based improvements

**Feedback Integration:**
- Pilot feedback incorporation
- Safety observer recommendations
- Maintenance team insights
- Regulatory requirement updates

---

## Approval and Authorization

**Flight Test Authorization:**

| Authority Level | Name | Signature | Date |
|----------------|------|-----------|------|
| Safety Officer | [TBD] | _____________ | _____ |
| Faculty Advisor | [TBD] | _____________ | _____ |
| Department Head | [TBD] | _____________ | _____ |

**Emergency Contacts:**
- **Emergency Services**: 911
- **Safety Officer**: [Phone Number]
- **Faculty Advisor**: [Phone Number]
- **Campus Security**: [Phone Number]

---

*These procedures must be followed for all flight operations. Any deviations require prior written approval from the Safety Officer and Faculty Advisor.*