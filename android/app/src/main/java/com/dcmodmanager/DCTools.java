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
import org.apache.commons.io.FileUtils;
import java.io.RandomAccessFile;
import java.nio.MappedByteBuffer;
import java.nio.ByteOrder;
import java.io.InputStream;
import java.io.FileInputStream;
import java.nio.ByteBuffer;
import java.nio.charset.Charset;
import java.util.Arrays;
import java.io.FileOutputStream;
import com.arsylk.mammonsmite.DestinyChild.DCDefine;
import com.arsylk.mammonsmite.DestinyChild.DCModel;
import com.arsylk.mammonsmite.DestinyChild.DCModelInfo;
import com.arsylk.mammonsmite.DestinyChild.DCSwapper;
import com.arsylk.mammonsmite.utils.Utils;
import java.nio.channels.FileChannel;
import com.arsylk.mammonsmite.Live2D.L2DModel;
import org.json.JSONObject;

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
    Pck sourcePck = null;
    Pck targetPck = null;
    try {
      sourcePck = DCTools.unpack(sourceFile, sourceDest, 1);
      targetPck = DCTools.unpack(targetFile, targetDest, 1);
    }
    catch(Exception ex) {
      try {
        sourcePck = DCTools.unpack(sourceFile, sourceDest, 0);
        targetPck = DCTools.unpack(targetFile, targetDest, 0);
      }
      catch(Exception e) {
        e.printStackTrace();
        show("Error extracting files for swapping " + e.getMessage(), 10);
      }
    }
    try {
      DCModel sourceDcModel = DCTools.pckToModel(sourcePck);
      L2DModel sourceLdModel = sourceDcModel.asL2DModel();
      JSONObject sourceLdModelInfo = DCModelInfo.getInstance().getModelInfo(sourceLdModel.getModelId());
      DCModel targetDcModel = DCTools.pckToModel(targetPck);
      L2DModel targetLdModel = targetDcModel.asL2DModel();
      DCSwapper swapper = new DCSwapper(sourceLdModel, targetLdModel);
      File resultPath = new File(this.TMP_PATH + "/swap_result");
      swapper.matchFiles();
      boolean noErrors = swapper.swapModels(resultPath);
      if(noErrors) {

        //pack swap to pck
        File swapPck = DCTools.pack(resultPath, targetFile);
        // publishProgress("swap pck: "+swapPck.getAbsolutePath());

        //update model info
        applyModelInfo(targetLdModel.getModelId(), sourceLdModelInfo);

        //backup original
        // FileUtils.moveFile(file, backup);
        // publishProgress("backup: "+backup);

        //load to game
        // show(swapPck.getPath(), 10);
        // FileUtils.copyFile(swapPck, file);
        // publishProgress("loaded: "+file.getAbsolutePath());
      }else {
        Log.d("DCTools", "ignored: " + targetPath);
      }
    }
    catch(Exception e) {
      e.printStackTrace();
      Log.d("DCTools", "Error swapping files " + e.getMessage());
    }
    // DCModel dcModel = DCTools.pckToModel(sourcePck);
  }

  public static File pack(File src) throws Exception {
    return pack(src, new File(src.getParent(), src.getParentFile().getName()+".pck"));
  }

  public static File pack(File src, File dst) throws Exception {
    Log.d("DCTools", "\n\nPACKING " + src.getPath() + " to " + dst.getPath() + "\n\n");
    if(src.exists()) {
        if(src.isDirectory()) {
            src = new File(src, "_header");
        }
        if(dst == null) {
            dst =  new File(src.getParent(), src.getParentFile().getName()+".pck");
        }

        //prepare
        JSONObject json = Utils.fileToJson(src);
        RandomAccessFile input = new RandomAccessFile(dst, "rw");

        //calculate initial offset
        int offset = 8 + 4 + json.length() * (8 + 1 + 4 + 4 + 8);
        //begin byte input
        input.write(DCDefine.PCK_IDENTIFIER);
        input.write(ByteBuffer.allocate(4).order(ByteOrder.LITTLE_ENDIAN).putInt(json.length()).array());
        for(int i = 0; i < json.length(); i++) {
            JSONObject sJson = json.getJSONObject(String.valueOf(i));
            String hash = sJson.getString("hash"), file = sJson.getString("file");
            input.write(Utils.hexToBytes(hash));
            input.write(ByteBuffer.allocate(1).order(ByteOrder.LITTLE_ENDIAN).put((byte)0x00).array());
            input.write(ByteBuffer.allocate(4).order(ByteOrder.LITTLE_ENDIAN).putInt(offset).array());
            long file_size = new File(src.getParent(), file).length();
            input.write(ByteBuffer.allocate(4).order(ByteOrder.LITTLE_ENDIAN).putInt((int)file_size).array());
            input.write(ByteBuffer.allocate(8).order(ByteOrder.LITTLE_ENDIAN).putLong(file_size).array());

            offset += file_size;
        }

        InputStream is;
        byte[] buffer = new byte[4096];
        for(int i = 0; i < json.length(); i++) {
            JSONObject sJson = json.getJSONObject(String.valueOf(i));
            is = new FileInputStream(new File(src.getParent(), sJson.getString("file")));
            int count;
            while((count = is.read(buffer)) > 0) {
                input.write(buffer, 0, count);
            }
            is.close();
        }
        input.close();
        return dst;
    }else {
        return null;
    }
  }

  public static JSONObject applyModelInfo(String modelIdx, JSONObject mode_info_values) throws Exception {
    JSONObject model_info = Utils.fileToJson(getDCModelInfoPath());
    JSONObject model_info_original = model_info.getJSONObject(modelIdx);

    //change value
    model_info.put(modelIdx, mode_info_values);

    //backup old file
    File bakFile = new File(getDCModelInfoPath().getAbsolutePath()+".bak");
    if(!bakFile.exists()) {
        FileUtils.moveFile(getDCModelInfoPath(), bakFile);
    }

    //write new json
    FileUtils.write(getDCModelInfoPath(), model_info.toString(2), Charset.forName("utf-8"));

    return model_info_original;
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