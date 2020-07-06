package com.dcmodmanager;

import android.widget.Toast;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.util.Log;
import com.dcmodmanager.DCTools;
import java.io.File;
import java.util.Map;
import java.util.HashMap;
import android.view.SurfaceHolder.Callback;
import com.arsylk.mammonsmite.DestinyChild.Pck;
import java.io.RandomAccessFile;
import java.nio.MappedByteBuffer;
import java.nio.ByteOrder;
import java.util.Arrays;
import java.io.FileOutputStream;
import com.arsylk.mammonsmite.DestinyChild.DCDefine;
import com.arsylk.mammonsmite.DestinyChild.DCModel;
import com.arsylk.mammonsmite.utils.Utils;
import java.nio.channels.FileChannel;

public class DCTools extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;
  private static String TMP_PATH;
  public static String APPS_PATH;

  DCTools(ReactApplicationContext context) {
    super(context);
    reactContext = context;
  }

  private static final String DURATION_SHORT_KEY = "SHORT";
  private static final String DURATION_LONG_KEY = "LONG";

  @Override
  public String getName() {
    return "DCTools";
  }

  @ReactMethod
  public void show(String message, int duration) {
    Toast.makeText(getReactApplicationContext(), message, duration).show();
  }

  @ReactMethod
  public void setTmpPath(String tmpPath) {
    TMP_PATH = tmpPath;
    File tmp = new File(tmpPath);
    if(!tmp.exists() || !tmp.isDirectory()) {
      tmp.mkdirs();
    }
  }

  @ReactMethod
  public void setAppsPath(String appsPath) {
    APPS_PATH = appsPath;
  }

  @ReactMethod
  public void swap(String sourcePath, String targetPath) {
    File sourceFile = new File(sourcePath);
    File sourceDest = new File(this.TMP_PATH + "/swap_source/");
    File targetFile = new File(targetPath);
    File targetDest = new File(this.TMP_PATH + "/swap_target/");
    try {
      DCTools.unpack(sourceFile, sourceDest, 1);
      DCTools.unpack(targetFile, targetDest, 1);
    }
    catch(Exception ex) {
      try {
        DCTools.unpack(sourceFile, sourceDest, 0);
        DCTools.unpack(targetFile, targetDest, 0);
      }
      catch(Exception e) {
        e.printStackTrace();
        show("Error swapping files " + e.getMessage(), 10);
      }
    }
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
    constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
    return constants;
  }

  public static Pck unpack(File src, File dst, int key) throws Exception {
    // make sure folders exist
    if(!dst.exists() || !dst.isDirectory()) {
        dst.mkdirs();
    } else {
        for(File tempFile : dst.listFiles()) {
            if(!tempFile.equals(src)) {
                tempFile.delete();
            }
        }
    }

    //create new pck struct
    Pck pck = new Pck(src, dst);

    //buffer src bytes
    RandomAccessFile fs = new RandomAccessFile(src, "r");
    MappedByteBuffer mbb = fs.getChannel().map(FileChannel.MapMode.READ_ONLY, 0, fs.length()).load();
    mbb.order(ByteOrder.LITTLE_ENDIAN);
    mbb.position(0);

    //begin byte analysis
    byte[] identifier = new byte[8];
    //byte(8) pck identifier
    mbb.get(identifier);
    if(Arrays.equals(identifier, DCDefine.PCK_IDENTIFIER)) {
        //byte(4) count
        int count = mbb.getInt();
        Log.d("mTag:Unpack", "File Count: "+count);
        for(int i = 0; i < count; i++) {
            byte[] hash = new byte[8];
            int flag, offset, size, size_p, ext;
            //byte(8) hash
            mbb.get(hash);
            String hashs = Utils.bytesToHex(hash);
            //byte(1) flag
            flag = mbb.get();
            //byte(4) offset
            offset = mbb.getInt();
            //byte(4) compressed size
            size_p = mbb.getInt();
            //byte(4) original size
            size = mbb.getInt();
            //byte(4) ???
            mbb.position(mbb.position()+4);

            //save old position
            int start = mbb.position();

            //start extract file
            mbb.position(offset);
            byte[] file_bytes = new byte[size_p];
            mbb.get(file_bytes);

            //change if necessary
            if(flag == 2 || flag == 3) {
                //aes
                byte[] after_aes = Utils.aes_decrypt(file_bytes, key);
                file_bytes = after_aes;
            }
            if(flag == 1 || flag == 3) {
                //yappy
                byte[] after_yappy = Utils.yappy_uncompress(file_bytes, size);
                file_bytes = after_yappy;
            }

            ext = getExtId(file_bytes[0] & 0xFF);

            //display progress
            String logLine = String.format("File %2d/%d %s [%016X | %6d] %02d %s", i+1, count, hashs, offset, size, flag, getExtStr(ext));
            Log.d("mTag:File", logLine);
            // if(progressCallback != null) progressCallback.onCompleted(null, logLine);

            //save extracted file (files starting with _ are unprocessed)
            File filepath = new File(dst, String.format("%08d.%s", i, getExtStr(ext)));
            if(!dst.exists()) dst.mkdirs();

            FileOutputStream fos = new FileOutputStream(filepath);
            fos.write(file_bytes);
            fos.close();

            //add to unpacked pck object
            pck.addFile(filepath, hash, ext, i);

            //restore old position
            mbb.position(start);
        }
        pck.generateHeader();
        Log.d("mTag:Unpack", "Unpacking finished: "+pck.getOutput());
    }else {
        Log.d("mTag:Unpack", "Inccorect file!");
        return null;
    }
    mbb.clear();
    fs.close();

    return pck;
  }

  public static String getExtStr(int extId) {
    switch(extId) {
        //json files
        case DCDefine.JSON:
            return "json";
        //motion files
        case DCDefine.MTN:
            return "mtn";
        //model files
        case DCDefine.DAT:
            return "dat";
        //textures
        case DCDefine.PNG:
            return "png";
    }
    return "unk";
  }

  public static int getExtId(int ext) {
    switch(ext) {
        //dat files
        case 109:
            return DCDefine.DAT;
        //mtn files
        case 35:
            return DCDefine.MTN;
        //png files
        case 137:
            return DCDefine.PNG;
        //json files
        case 123:
            return DCDefine.JSON;
    }
    return DCDefine.UNKNOWN;
  }

  //pck files to models
  public static DCModel pckToModel(Pck pck) throws Exception {
    //create new model
    DCModel dcModel = new DCModel(pck);
    pck.generateHeader();

    return dcModel;
  }

  public static File getDCModelInfoPath() {
    return new File(APPS_PATH + "/com.linegames.dcglobal/files/asset/character/model_info.json");
  }
}