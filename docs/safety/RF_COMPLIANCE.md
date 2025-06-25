# RF Compliance and Safety Documentation

**Project**: ECE496 Indoor UWB-Based Drone Localization  
**Document Version**: 1.0  
**Date**: 2025-06-25  
**Compliance Standard**: FCC Part 15, Industry Canada RSS-210

## 1. Executive Summary

This document outlines the radio frequency (RF) compliance requirements, safety procedures, and regulatory obligations for the drone localization system. The system utilizes multiple RF technologies including UWB, Wi-Fi, and Bluetooth for communication and positioning.

## 2. RF System Overview

### 2.1 RF Components and Frequencies

| Component | Frequency Band | Power Output | Standard |
|-----------|----------------|--------------|----------|
| **UWB Modules (DWM3001CDK)** | 3.5-6.5 GHz | <-10 dBm EIRP | FCC Part 15.515 |
| **Wi-Fi Communication** | 2.4 GHz ISM | <30 dBm EIRP | FCC Part 15.247 |
| **Wi-Fi 5GHz (backup)** | 5.15-5.825 GHz | <30 dBm EIRP | FCC Part 15.407 |
| **Bluetooth** | 2.4 GHz ISM | <4 dBm EIRP | FCC Part 15.249 |

### 2.2 System Architecture

```
UWB Anchors (Fixed) ←→ UWB Tag (Mobile) ←→ Flight Controller ←→ Ground Station
     ↓                      ↓                     ↓              ↓
  Positioning            Ranging              Control         Monitoring
```

## 3. Regulatory Compliance

### 3.1 FCC Compliance (United States)

#### Part 15.515 - Ultra-Wideband (UWB) Systems

**Permitted Use:**
- Indoor and handheld UWB systems
- Vehicular radar systems (applicable to drone operations)
- Communication and measurement systems

**Power Limits:**
- **3.1-10.6 GHz**: -41.3 dBm/MHz EIRP
- **Below 960 MHz**: -75.3 dBm/MHz EIRP
- **Above 10.6 GHz**: -51.3 dBm/MHz EIRP

**Our Compliance:**
- DWM3001CDK operates at -10 dBm peak power
- Well below FCC limits for indoor operation
- No external power amplification

#### Part 15.247 - 2.4 GHz ISM Band

**Requirements:**
- Spread spectrum or digital modulation required
- Maximum power: 1 Watt (30 dBm)
- Antenna gain limitations apply

**Our Compliance:**
- Wi-Fi uses DSSS/OFDM modulation
- Power output <100mW (20 dBm)
- Standard dipole antennas (<2.14 dBi gain)

### 3.2 Industry Canada (IC) Compliance

**RSS-210**: Low-power License-exempt Radiocommunication Devices

- UWB systems must comply with RSS-220
- 2.4 GHz devices under RSS-210 Category I
- Equipment must be IC certified

### 3.3 International Compliance

**European (CE):**
- EN 302 065 for UWB equipment
- EN 300 328 for 2.4 GHz equipment
- RED Directive 2014/53/EU

## 4. RF Safety Requirements

### 4.1 Specific Absorption Rate (SAR)

**FCC Guidelines:**
- **Handheld devices**: 1.6 W/kg (1g tissue)
- **Body-worn devices**: 2.0 W/kg (10g tissue)

**Our System Assessment:**
- UWB power levels well below SAR thresholds
- Wi-Fi modules comply with IC/FCC SAR limits
- Recommended minimum 20cm separation during operation

### 4.2 RF Exposure Limits

**Maximum Permissible Exposure (MPE):**

| Frequency | Power Density | Electric Field |
|-----------|---------------|----------------|
| 2.4 GHz | 1.0 mW/cm² | 61.4 V/m |
| 5.8 GHz | 1.0 mW/cm² | 61.4 V/m |
| UWB (6 GHz) | 1.0 mW/cm² | 61.4 V/m |

**Compliance Measures:**
- Power levels result in <0.01 mW/cm² at 20cm
- Well below MPE limits at operational distances
- No prolonged direct contact with antennas required

### 4.3 RF Safety Procedures

**During Operation:**
- Maintain 20cm minimum distance from transmitting antennas
- Avoid prolonged exposure to active RF sources
- Monitor for any unusual heating of RF components
- Use RF power meters to verify output levels

**Installation Safety:**
- Use proper ESD protection when handling RF modules
- Ensure proper antenna connections to avoid high SWR
- Test RF output after any modifications
- Document all RF power measurements

## 5. Equipment Certification

### 5.1 Required Certifications

**UWB Modules (DWM3001CDK):**
- FCC ID: QORMOMDWM3001CDK
- IC: 8976C-DWM3001CDK
- CE: Compliant under RED Directive

**Wi-Fi Modules:**
- FCC ID: [Module specific - ESP32/similar]
- IC: [Module specific]
- Wi-Fi Alliance certification

### 5.2 Certification Verification

Before deployment:
- [ ] Verify FCC ID in FCC database
- [ ] Check IC certification status
- [ ] Confirm equipment authorization is current
- [ ] Validate power output specifications

## 6. Interference Management

### 6.1 Potential Interference Sources

**External:**
- Other Wi-Fi networks (2.4/5 GHz)
- Bluetooth devices
- Microwave ovens (2.4 GHz)
- Industrial heating equipment
- Other UWB systems

**Internal:**
- Multi-path reflections in indoor environment
- Interference between UWB and Wi-Fi
- Ground plane interactions
- Metal structure reflections

### 6.2 Interference Mitigation

**Frequency Management:**
- Use different Wi-Fi channels (1, 6, 11 in 2.4 GHz)
- Implement frequency hopping where possible
- Monitor spectrum before operations
- Coordinate with other RF users in area

**System Design:**
- Physical separation of antennas (>λ/4)
- RF shielding for sensitive components
- Proper grounding and filtering
- Automatic channel selection algorithms

### 6.3 Interference Testing

**Pre-deployment:**
- Spectrum analysis of operating environment
- Co-location testing of all RF systems
- Range testing with all systems active
- Interference susceptibility testing

**Ongoing monitoring:**
- Regular spectrum monitoring
- Performance degradation checks
- Interference incident logging
- Periodic re-certification testing

## 7. Installation and Testing

### 7.1 RF System Installation

**UWB Anchor Placement:**
- Minimum 2m separation between anchors
- Avoid metallic obstructions
- Position for optimal coverage geometry
- Document antenna orientations and locations

**Communication System Setup:**
- Select clear Wi-Fi channels
- Verify antenna connections and SWR
- Test communication range and reliability
- Implement backup communication paths

### 7.2 RF Performance Testing

**Required Tests:**
- [ ] Power output verification
- [ ] Frequency accuracy measurement
- [ ] Spurious emission testing
- [ ] Range and coverage validation
- [ ] Interference susceptibility
- [ ] SAR compliance verification (if required)

**Test Equipment:**
- Spectrum analyzer (9 kHz - 26.5 GHz)
- RF power meter
- Signal generator
- Network analyzer
- EMI test receiver

### 7.3 Documentation Requirements

**Test Records:**
- Power output measurements
- Frequency stability data
- Spurious emission plots
- Range test results
- Interference analysis
- Calibration certificates

## 8. Operational Procedures

### 8.1 Pre-Operation RF Checks

- [ ] Verify all RF equipment powered properly
- [ ] Check antenna connections and integrity
- [ ] Confirm frequency settings
- [ ] Test communication links
- [ ] Monitor for interference sources
- [ ] Verify emergency shutdown capability

### 8.2 During Operation

**Monitoring:**
- Continuous link quality monitoring
- Periodic power output verification
- Interference detection and logging
- Temperature monitoring of RF components

**Restrictions:**
- No operation near sensitive receivers
- Avoid areas with known interference
- Maintain logs of RF operations
- Report any unusual behavior immediately

### 8.3 Post-Operation

- [ ] Power down RF systems in proper sequence
- [ ] Log operation time and performance
- [ ] Note any anomalies or interference
- [ ] Secure RF equipment properly
- [ ] Update operational logs

## 9. Regulatory Obligations

### 9.1 Equipment Authorization

**Requirements:**
- All RF equipment must have valid equipment authorization
- No modifications to certified equipment without re-certification
- Equipment must be operated within authorized parameters

**Responsibilities:**
- Verify equipment authorization before use
- Maintain copies of authorization documents
- Report any equipment modifications to certification body

### 9.2 Interference Resolution

**Obligations:**
- Resolve harmful interference immediately
- Cooperate with other authorized users
- Modify or cease operation if causing interference
- Report persistent interference to regulatory authorities

**Process:**
1. Identify interference source
2. Attempt technical resolution
3. Coordinate with affected parties
4. Document resolution efforts
5. Implement permanent solution

### 9.3 Record Keeping

**Required Records:**
- Equipment authorization documents
- Technical specifications and manuals
- Installation and test records
- Operational logs and incident reports
- Maintenance and modification records

**Retention Period:**
- Maintain records for life of equipment plus 1 year
- Keep copies of all regulatory filings
- Preserve test data and certification documents

## 10. Training and Awareness

### 10.1 RF Safety Training

**Required for all personnel:**
- RF safety awareness
- Equipment-specific training
- Emergency procedures
- Regulatory requirements

**Training topics:**
- RF exposure limits and safety distances
- Proper equipment operation
- Interference identification and resolution
- Regulatory compliance obligations

### 10.2 Ongoing Education

- Annual RF safety review
- Updates on regulatory changes
- New equipment training
- Incident-based training updates

## 11. Emergency Procedures

### 11.1 RF-Related Emergencies

**High RF Exposure:**
- Remove personnel from RF field immediately
- Power down RF equipment
- Seek medical attention if symptoms present
- Document exposure incident

**Equipment Malfunction:**
- Shut down affected RF equipment
- Isolate fault to prevent interference
- Notify regulatory authorities if required
- Repair or replace before resuming operation

### 11.2 Interference Incidents

**Causing Interference:**
- Immediately cease operation
- Identify affected services
- Implement temporary mitigation
- Work toward permanent resolution

**Experiencing Interference:**
- Document interference characteristics
- Attempt technical resolution
- Contact interfering source if identified
- Report to regulatory authorities if unresolved

---

## Regulatory Contact Information

**FCC (United States):**
- Equipment Authorization: (301) 725-1585
- Interference Complaints: (888) CALL-FCC

**Industry Canada:**
- Spectrum Management: (613) 990-4700
- Interference Resolution: Local district office

**Emergency Contacts:**
- Campus RF Coordinator: [Phone Number]
- Regulatory Affairs Office: [Phone Number]
- Safety Officer: [Phone Number]

---

**Certification Statement:**

This RF compliance document has been reviewed and approved for the ECE496 drone project. All equipment and operations must comply with the requirements outlined in this document.

| Role | Name | Signature | Date |
|------|------|-----------|------|
| RF Engineer | [TBD] | _____________ | _____ |
| Safety Officer | [TBD] | _____________ | _____ |
| Faculty Advisor | [TBD] | _____________ | _____ |

*This document must be updated whenever RF equipment or operating procedures change.*