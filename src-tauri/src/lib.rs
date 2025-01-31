use std::fs;

use nanoid::nanoid;
use short_uuid::short;
use snowflake::SnowflakeIdGenerator;
use sonyflake::Sonyflake;
use tauri::menu::{AboutMetadata, MenuBuilder, MenuItemBuilder, SubmenuBuilder};
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_opener::OpenerExt;
use ulid::Ulid;
use uuid::Uuid;

#[tauri::command]
fn gen_uuid_v1() -> String {
    Uuid::now_v1(&[1, 2, 3, 4, 5, 6]).hyphenated().to_string()
}

#[tauri::command]
fn gen_uuid_v3(namespace: &str, name: &str) -> String {
    if namespace.is_empty() || name.is_empty() {
        return "".to_string();
    }
    let ns = Uuid::parse_str(namespace);
    match ns {
        Ok(v) => Uuid::new_v3(&v, name.as_bytes()).hyphenated().to_string(),
        Err(_) => "".to_string(),
    }
}

#[tauri::command]
fn gen_uuid_v4() -> String {
    Uuid::new_v4().hyphenated().to_string()
}

#[tauri::command]
fn gen_uuid_v5(namespace: &str, name: &str) -> String {
    if namespace.is_empty() || name.is_empty() {
        return "".to_string();
    }
    let ns = Uuid::parse_str(namespace);
    match ns {
        Ok(v) => Uuid::new_v5(&v, name.as_bytes()).hyphenated().to_string(),
        Err(_) => "".to_string(),
    }
}

#[tauri::command]
fn gen_uuid_v6() -> String {
    Uuid::now_v6(&[1, 2, 3, 4, 5, 6]).hyphenated().to_string()
}

#[tauri::command]
fn gen_uuid_v7() -> String {
    Uuid::now_v7().hyphenated().to_string()
}

#[tauri::command]
fn gen_short_uuid() -> String {
    let shortened_uuid = short!();
    shortened_uuid.to_string()
}

#[tauri::command]
fn gen_nil_uuid() -> String {
    "00000000-0000-0000-0000-000000000000".to_string()
}

#[tauri::command]
fn gen_max_uuid() -> String {
    "FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF".to_string()
}

#[tauri::command]
fn gen_nano_id() -> String {
    nanoid!()
}

#[tauri::command]
fn gen_ulid() -> String {
    let ulid = Ulid::new();
    ulid.to_string()
}

#[tauri::command]
fn gen_cuid() -> String {
    cuid::cuid1().unwrap()
}

#[tauri::command]
fn gen_cuid2() -> String {
    cuid::cuid2()
}

#[tauri::command]
fn gen_nuid() -> String {
    nuid::next().to_string()
}

#[tauri::command]
fn gen_snowflake() -> String {
    let mut g = SnowflakeIdGenerator::new(1, 1);
    g.generate().to_string()
}

#[tauri::command]
fn gen_sonyflake() -> String {
    let sf = Sonyflake::new().unwrap();
    let next_id = sf.next_id().unwrap();
    format!("{}", next_id)
}

#[tauri::command]
fn gen_upid(prefix: &str) -> String {
    upid::Upid::new(prefix).to_string()
}

#[tauri::command]
fn gen_tsid() -> String {
    tsid::create_tsid().to_string()
}

#[tauri::command]
fn gen_object_id() -> String {
    bson::oid::ObjectId::new().to_string()
}

#[tauri::command]
fn gen_scru128() -> String {
    scru128::new_string()
}

#[tauri::command]
async fn save_to_file(app: tauri::AppHandle, content: &str, file_name: &str) -> Result<(), String> {
    let file_path = app
        .dialog()
        .file()
        .set_file_name(file_name)
        .blocking_save_file();
    if let Some(path) = file_path {
        match fs::write(path.to_string(), content) {
            Ok(_) => println!("File saved"),
            Err(e) => eprintln!("Failed to save file: {}", e),
        }
    }
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let github = MenuItemBuilder::new("Github").id("github").build(app)?;
            let rfc9562 = MenuItemBuilder::new("RFC 9562").id("rfc9562").build(app)?;
            let app_submenu = SubmenuBuilder::new(app, "App")
                .about(Some(AboutMetadata {
                    ..Default::default()
                }))
                .separator()
                .item(&github)
                .item(&rfc9562)
                .separator()
                .services()
                .separator()
                .hide()
                .hide_others()
                .quit()
                .build()?;
            let menu = MenuBuilder::new(app).items(&[&app_submenu]).build()?;
            app.set_menu(menu)?;
            app.on_menu_event(move |app, event| {
                if event.id() == github.id() {
                    app.opener()
                        .open_url("https://github.com/hiql/get-unique-id-app", None::<&str>)
                        .unwrap();
                } else if event.id() == rfc9562.id() {
                    app.opener()
                        .open_url("https://www.rfc-editor.org/rfc/rfc9562.html", None::<&str>)
                        .unwrap();
                }
            });
            Ok(())
        })
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            save_to_file,
            gen_uuid_v1,
            gen_uuid_v3,
            gen_uuid_v4,
            gen_uuid_v5,
            gen_uuid_v6,
            gen_uuid_v7,
            gen_short_uuid,
            gen_nil_uuid,
            gen_max_uuid,
            gen_ulid,
            gen_upid,
            gen_nano_id,
            gen_cuid,
            gen_cuid2,
            gen_nuid,
            gen_tsid,
            gen_snowflake,
            gen_sonyflake,
            gen_object_id,
            gen_scru128
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_gen_nil_empty_uuid() {
        let expected = "00000000-0000-0000-0000-000000000000";
        let id = gen_nil_uuid();
        println!("{:?}", id);
        assert_eq!(expected, id);
    }
}
