import React, { useState, useRef, useEffect } from 'react';
import Peer from 'simple-peer';
import { toast } from 'react-hot-toast';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import './VideoChat.css';

const VideoChat = ({ 
  isOpen, 
  onClose, 
  user, 
  peerUser,
  isCaller = false,
  onCallStart,
  onCallEnd 
}) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peer, setPeer] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callTimer, setCallTimer] = useState(null);

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerRef = useRef();

  // Initialize video call
  useEffect(() => {
    if (isOpen) {
      startLocalStream();
      if (isCaller) {
        startCall();
      }
    }

    return () => {
      stopCall();
    };
  }, [isOpen]);

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast.error('Cannot access camera/microphone');
    }
  };

  const startCall = () => {
    if (!localStream) return;

    setIsCalling(true);
    
    // In a real app, you would create a peer connection through a signaling server
    const newPeer = new Peer({
      initiator: isCaller,
      trickle: false,
      stream: localStream
    });

    newPeer.on('signal', (data) => {
      // Send signaling data to peer through your signaling server
      console.log('Signal data:', data);
    });

    newPeer.on('stream', (stream) => {
      setRemoteStream(stream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
      setIsConnected(true);
      startCallTimer();
    });

    newPeer.on('connect', () => {
      console.log('Peer connected');
      setIsConnected(true);
      startCallTimer();
    });

    newPeer.on('error', (err) => {
      console.error('Peer error:', err);
      toast.error('Connection error');
      stopCall();
    });

    newPeer.on('close', () => {
      console.log('Peer connection closed');
      stopCall();
    });

    setPeer(newPeer);
    peerRef.current = newPeer;
  };

  const stopCall = () => {
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }

    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }

    if (remoteStream) {
      setRemoteStream(null);
    }

    if (callTimer) {
      clearInterval(callTimer);
      setCallTimer(null);
    }

    setIsCalling(false);
    setIsConnected(false);
    setCallDuration(0);

    if (onCallEnd) {
      onCallEnd();
    }
  };

  const startCallTimer = () => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    setCallTimer(timer);
  };

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAcceptCall = () => {
    if (!isCaller) {
      startCall();
    }
  };

  const handleEndCall = () => {
    stopCall();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      preventCloseOnOverlay={true}
      className="video-chat-modal"
      overlayClassName="video-chat-overlay"
    >
      <div className="video-chat-container">
        {/* Remote Video */}
        <div className="remote-video-container">
          {remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="remote-video"
            />
          ) : (
            <div className="remote-video-placeholder">
              <div className="placeholder-avatar">
                {peerUser?.avatar ? (
                  <img src={peerUser.avatar} alt={peerUser.name} />
                ) : (
                  <span className="avatar-initial">
                    {peerUser?.name?.charAt(0)}
                  </span>
                )}
              </div>
              <h3 className="placeholder-name">{peerUser?.name}</h3>
              <p className="placeholder-status">
                {isCalling ? 'Calling...' : 'Connecting...'}
              </p>
            </div>
          )}
          
          {/* Call Info Overlay */}
          <div className="call-info-overlay">
            <div className="call-info">
              <div className="call-user-info">
                <span className="user-name">{peerUser?.name}</span>
                {peerUser?.isVerified && (
                  <span className="verified-badge-mini">✓</span>
                )}
                {peerUser?.isPremium && (
                  <span className="premium-badge-mini">👑</span>
                )}
              </div>
              <div className="call-duration">
                {formatDuration(callDuration)}
              </div>
            </div>
          </div>
        </div>

        {/* Local Video */}
        <div className="local-video-container">
          {localStream && (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="local-video"
            />
          )}
        </div>

        {/* Call Controls */}
        <div className="call-controls">
          <div className="control-buttons">
            <Button
              variant={isMuted ? "danger" : "outline"}
              className="control-btn"
              onClick={toggleMute}
              startIcon={isMuted ? "🔇" : "🎤"}
            >
              {isMuted ? 'Unmute' : 'Mute'}
            </Button>
            
            <Button
              variant={isVideoOff ? "danger" : "outline"}
              className="control-btn"
              onClick={toggleVideo}
              startIcon={isVideoOff ? "📷" : "📹"}
            >
              {isVideoOff ? 'Video On' : 'Video Off'}
            </Button>
            
            {!isConnected && !isCaller && (
              <Button
                variant="success"
                className="control-btn"
                onClick={handleAcceptCall}
                startIcon="📞"
              >
                Accept
              </Button>
            )}
            
            <Button
              variant="danger"
              className="control-btn end-call-btn"
              onClick={handleEndCall}
              startIcon="📞"
            >
              End Call
            </Button>
          </div>
        </div>

        {/* Call Status */}
        {!isConnected && (
          <div className="call-status">
            <div className="call-status-content">
              {isCaller ? (
                <>
                  <div className="calling-animation">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <p className="calling-text">Calling {peerUser?.name}...</p>
                </>
              ) : (
                <>
                  <div className="ringing-animation">
                    <span className="ring"></span>
                    <span className="ring"></span>
                    <span className="ring"></span>
                  </div>
                  <p className="ringing-text">
                    {peerUser?.name} is calling...
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default VideoChat;