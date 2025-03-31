import express, { Request, Response } from 'express';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { MessageData, Message } from '../models/types.js';
import { v4 as uuidv4 } from 'uuid';
import { getUserById } from '../utils/fileUtils.js';

// Define __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to message data file
const DATA_DIR = path.resolve(__dirname, '../../../data');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

const router = express.Router();

// Read messages data
const readMessagesFile = async (): Promise<MessageData> => {
  try {
    const data = await fs.readJson(MESSAGES_FILE) as MessageData;
    return data;
  } catch (error) {
    console.error('Error reading messages file:', error);
    throw error;
  }
};

// Write messages data
const writeMessagesFile = async (data: MessageData): Promise<void> => {
  try {
    await fs.writeJson(MESSAGES_FILE, data, { spaces: 2 });
  } catch (error) {
    console.error('Error writing messages file:', error);
    throw error;
  }
};

// Get all messages for a user (both sent and received)
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    // Verify user exists
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const data = await readMessagesFile();
    const userMessages = data.messages.filter(
      message => message.senderId === userId || message.receiverId === userId
    );
    
    res.status(200).json(userMessages);
  } catch (error) {
    console.error('Error fetching user messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get conversation between two users
router.get('/conversation/:userId/:otherUserId', async (req: Request, res: Response) => {
  try {
    const { userId, otherUserId } = req.params;
    
    // Verify both users exist
    const user = await getUserById(userId);
    const otherUser = await getUserById(otherUserId);
    
    if (!user || !otherUser) {
      return res.status(404).json({ message: 'One or both users not found' });
    }
    
    const data = await readMessagesFile();
    const conversation = data.messages.filter(
      message => 
        (message.senderId === userId && message.receiverId === otherUserId) ||
        (message.senderId === otherUserId && message.receiverId === userId)
    );
    
    // Sort by timestamp
    conversation.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    res.status(200).json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send a message
router.post('/', async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId, content } = req.body;
    
    // Validate required fields
    if (!senderId || !receiverId || !content) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Verify both users exist
    const sender = await getUserById(senderId);
    const receiver = await getUserById(receiverId);
    
    if (!sender || !receiver) {
      return res.status(404).json({ message: 'One or both users not found' });
    }
    
    // Create new message
    const newMessage: Message = {
      id: uuidv4(),
      senderId,
      receiverId,
      content,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    // Add message to file
    const data = await readMessagesFile();
    data.messages.push(newMessage);
    await writeMessagesFile(data);
    
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark a message as read
router.put('/:messageId/read', async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const { userId } = req.body;
    
    // Validate required fields
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    // Get message data
    const data = await readMessagesFile();
    const messageIndex = data.messages.findIndex(message => message.id === messageId);
    
    if (messageIndex === -1) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    const message = data.messages[messageIndex];
    
    // Verify user is the receiver
    if (message.receiverId !== userId) {
      return res.status(403).json({ message: 'Not authorized to mark this message as read' });
    }
    
    // Update message
    data.messages[messageIndex].read = true;
    await writeMessagesFile(data);
    
    res.status(200).json(data.messages[messageIndex]);
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a message
router.delete('/:messageId', async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const { userId } = req.body;
    
    // Validate required fields
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    // Get message data
    const data = await readMessagesFile();
    const messageIndex = data.messages.findIndex(message => message.id === messageId);
    
    if (messageIndex === -1) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    const message = data.messages[messageIndex];
    
    // Verify user is the sender
    if (message.senderId !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }
    
    // Remove message
    data.messages.splice(messageIndex, 1);
    await writeMessagesFile(data);
    
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 