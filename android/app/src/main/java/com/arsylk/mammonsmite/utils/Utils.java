package com.arsylk.mammonsmite.utils;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.preference.PreferenceManager;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import org.apache.commons.io.FileUtils;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.SecretKeySpec;
import java.io.*;
import java.nio.*;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.*;

public class Utils {

  /*yappy start*/
  private static int[][] yappy_maps = new int[32][16];
  private static int[] yappy_info = new int[256];
  private static boolean yappy_mapped = false;

  private static void yappy_fill() {
      long step = 1 << 16;
      for(int i = 0; i < 16; ++i) {
          int value = 65535;
          step = ((step * 67537) >> 16);
          while(value < (29L << 16)) {
              yappy_maps[value >> 16][i] = 1;
              value = (int) ((value * step) >> 16);
          }
      }

      int cntr = 0;
      for(int i = 0; i < 29; ++i) {
          for(int j = 0; j < 16; ++j) {
              if(yappy_maps[i][j] != 0) {
                  yappy_info[32 + cntr] = i + 4 + (j << 8);
                  yappy_maps[i][j] = 32 + cntr;
                  cntr += 1;
              }else {
                  if(i == 0)
                      throw new EmptyStackException();
                  yappy_maps[i][j] = yappy_maps[i - 1][j];
              }
          }
      }
      if(cntr != 256 - 32) {
          throw new EmptyStackException();
      }
      yappy_mapped = true;
  }

  public static byte[] yappy_uncompress(byte[] data, int size) {
      if(!yappy_mapped)
          yappy_fill();

      ArrayList<Byte> to = new ArrayList<>();
      int data_p = 0;
      int to_p = 0;
      while(to.size() < size) {
          if(!(data_p + 1 < data.length))
              return data;

          int index = data[data_p] & 0xFF;
          if(index < 32) {
              byte[] copy = Arrays.copyOfRange(data, data_p+1, (data_p+1)+(index+1));
              for(byte byte_copy : copy) {
                  to.add(byte_copy);
              }
              to_p += index + 1;
              data_p += index + 2;
          }else {
              int info = yappy_info[index];
              int length = info & 0x00ff;
              int offset = (info & 0xff00) + (data[data_p+1] & 0xFF);
              List<Byte> copy = to.subList((to_p - offset), Math.min((to_p - offset)+length, to.size()));
              to.addAll(copy);
              to_p += length;
              data_p += 2;
          }
      }

      byte[] to_byte = new byte[to.size()];
      for(int i = 0; i < to.size(); i++) {
          to_byte[i] = to.get(i);
      }
      return to_byte;
  }
  /*yappy end*/

  /*aes start*/
  private static Cipher[] cipher = {null, null};
  private static boolean[] cipher_made = {false, false};

  private static void make_cipher(int key) throws InvalidKeyException, NoSuchPaddingException, NoSuchAlgorithmException {
      if(key == 0) {
          byte[] key0 = new byte[] {(byte) 0x37, (byte) 0xea, (byte) 0x79, (byte) 0x85, (byte) 0x86, (byte) 0x29, (byte) 0xec, (byte) 0x94, (byte) 0x85, (byte) 0x20, (byte) 0x7c, (byte) 0x1a, (byte) 0x62, (byte) 0xc3, (byte) 0x72, (byte) 0x4f, (byte) 0x72, (byte) 0x75, (byte) 0x25, (byte) 0x0b, (byte) 0x99, (byte) 0x99, (byte) 0xbd, (byte) 0x7f, (byte) 0x0b, (byte) 0x24, (byte) 0x9a, (byte) 0x8d, (byte) 0x85, (byte) 0x38, (byte) 0x0e, (byte) 0x39};
          cipher[key] = Cipher.getInstance("AES/ECB/NoPadding");
          cipher[key].init(Cipher.DECRYPT_MODE, new SecretKeySpec(key0, "AES"));
          cipher_made[key] = true;
      }else if(key == 1) {
          byte[] key1 = new byte[] {(byte) 0xEF, (byte) 0xBB, (byte) 0xBF, (byte) 0xEC, (byte) 0x8B, (byte) 0x9C, (byte) 0xED, (byte) 0x94, (byte) 0x84, (byte) 0xED, (byte) 0x8A, (byte) 0xB8, (byte) 0xEC, (byte) 0x97, (byte) 0x85, (byte) 0xEA, (byte) 0xB3, (byte) 0xBC, (byte) 0xEB, (byte) 0x9D, (byte) 0xBC, (byte) 0xEC, (byte) 0x9D, (byte) 0xB8, (byte) 0xEA, (byte) 0xB2, (byte) 0x8C, (byte) 0xEC, (byte) 0x9E, (byte) 0x84, (byte) 0xEC, (byte) 0xA6};
          cipher[key] = Cipher.getInstance("AES/ECB/NoPadding");
          cipher[key].init(Cipher.DECRYPT_MODE, new SecretKeySpec(key1, "AES"));
          cipher_made[key] = true;
      }

  }

  public static byte[] aes_decrypt(byte[] data, int key) throws BadPaddingException, IllegalBlockSizeException, NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException {
      if(!cipher_made[key])
          make_cipher(key);

      //16 byte blocks
      data = Arrays.copyOf(data, data.length+(16 - (data.length % 16)));

      return cipher[key].doFinal(data);
  }
  /*aes end*/

  public static String bytesToHex(byte[] bytes) {
    char[] hexArray = {'0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'};
    char[] hexChars = new char[bytes.length * 2];
    for(int i = 0; i < bytes.length; i++) {
        int v = bytes[i] & 0xFF;
        hexChars[i * 2] = hexArray[v >>> 4];
        hexChars[i * 2 + 1] = hexArray[v & 0x0F];
    }
    return new String(hexChars);
  }

  public static File rename(File file, String newName) {
    File rename = new File(file.getParent(), newName);
    if(file.renameTo(rename)) {
        file = rename;
    }
    return file;
}
}
